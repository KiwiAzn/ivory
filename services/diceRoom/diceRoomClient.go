// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
	"github.com/kiwiazn/ivory/services/diceRoom/models"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512

	dayInNanoSeconds = 86400000000000
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	// The websocket connection.
	conn *websocket.Conn

	// Room name
	roomName string

	// Redis client
	redisClient *redis.Client
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
	defer func() {
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	key := "room:" + c.roomName

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		var diceRoll models.DiceRollMessage
		jsonErr := json.Unmarshal(message, &diceRoll)

		if jsonErr != nil {
			continue
		}

		if !validateDiceRoll(diceRoll) {
			continue
		}

		diceRollWithTimeStamp := models.DiceRoll{
			RollerName:      diceRoll.RollerName,
			Notation:        diceRoll.Notation,
			ResultBreakdown: diceRoll.Notation,
			Result:          diceRoll.Result,
			RolledAt:        time.Now(),
		}

		ctx := context.TODO()
		encodedDiceRoll, err := json.Marshal(diceRollWithTimeStamp)
		c.redisClient.Publish(ctx, key, encodedDiceRoll)
		c.redisClient.LPush(ctx, key+":diceRolls", encodedDiceRoll)
		c.redisClient.Expire(ctx, key+":diceRolls", 1*dayInNanoSeconds)
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)

	ctx := context.TODO()
	key := "room:" + c.roomName

	pubsub := c.redisClient.Subscribe(ctx, key)

	redisChannel := pubsub.Channel()

	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-redisChannel:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write([]byte(message.Payload))

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func validateDiceRoll(diceRoll models.DiceRollMessage) bool {
	if (models.DiceRollMessage{}) == diceRoll {
		return false
	}

	if diceRoll.RollerName == "" {
		log.Println("Missing RollerName")
		return false
	}

	if diceRoll.Notation == "" {
		log.Println("Missing Notation")
		return false
	}

	if diceRoll.ResultBreakdown == "" {
		log.Println("Missing ResultBeakdown")
		return false
	}

	return true
}

// serveWs handles websocket requests from the peer.
func serveWs(roomName string, redisClient *redis.Client, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{redisClient: redisClient, roomName: roomName, conn: conn}

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
