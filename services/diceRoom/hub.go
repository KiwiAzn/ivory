package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/go-redis/redis/v8"
	"github.com/kiwiazn/ivory/services/diceRoom/models"
)

// Hub maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	// Room name
	name string

	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Redis client
	redisClient *redis.Client
}

func newHub(redisClient *redis.Client, name string) *Hub {
	return &Hub{
		name:        name,
		broadcast:   make(chan []byte),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]bool),
		redisClient: redisClient,
	}
}

func validateDiceRoll(diceRoll models.DiceRollWithSender) bool {
	if (models.DiceRollWithSender{}) == diceRoll {
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

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			// Store message
			var diceRoll models.DiceRollWithSender
			err := json.Unmarshal(message, &diceRoll)

			if err != nil {
				continue
			}

			if !validateDiceRoll(diceRoll) {
				continue
			}

			ctx := context.TODO()
			key := "room:" + h.name + ":diceRolls"
			encodedDiceRoll, err := json.Marshal(diceRoll)
			h.redisClient.LPush(ctx, key, encodedDiceRoll)

			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
