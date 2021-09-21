package main

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/kiwiazn/ivory/services/diceRoom/models"
)

func main() {
	// Connect to redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Setup websockets
	hubs := make(map[string]*Hub)

	r.GET("/room/:roomId/diceRolls", func(c *gin.Context) {
		roomId := c.Param("roomId")

		ctx := context.TODO()
		key := "room:" + roomId + ":diceRolls"
		result := rdb.LRange(ctx, key, 0, -1)

		var diceRolls []models.DiceRollWithSender

		for _, diceRollAsString := range result.Val() {
			var diceRoll models.DiceRollWithSender
			json.Unmarshal([]byte(diceRollAsString), &diceRoll)

			diceRolls = append(diceRolls, diceRoll)
		}

		c.JSON(http.StatusOK, diceRolls)
	})

	r.GET("/room/:roomId/diceRolls/ws", func(c *gin.Context) {
		roomId := c.Param("roomId")
		hub := hubs[roomId]

		if hub == nil {
			hubs[roomId] = newHub(rdb, roomId)
			hub = hubs[roomId]
			go hub.run()
		}

		serveWs(hub, c.Writer, c.Request)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
