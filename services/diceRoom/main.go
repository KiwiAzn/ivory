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

	r.GET("/room/:roomName/diceRolls", func(c *gin.Context) {
		roomName := c.Param("roomName")

		ctx := context.TODO()
		key := "room:" + roomName + ":diceRolls"
		result := rdb.LRange(ctx, key, 0, -1)

		var diceRolls []models.DiceRollWithSender

		for _, diceRollAsString := range result.Val() {
			var diceRoll models.DiceRollWithSender
			json.Unmarshal([]byte(diceRollAsString), &diceRoll)

			diceRolls = append(diceRolls, diceRoll)
		}

		c.JSON(http.StatusOK, diceRolls)
	})

	r.GET("/room/:roomName/diceRolls/ws", func(c *gin.Context) {
		roomName := c.Param("roomName")

		serveWs(roomName, rdb, c.Writer, c.Request)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
