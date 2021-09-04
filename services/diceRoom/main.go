package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiwiazn/ivory/services/diceRoom/models"
)

func main() {
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
		hub := hubs[roomId]

		if hub != nil {
			c.JSON(http.StatusOK, hub.diceRolls)
			return
		}

		c.JSON(http.StatusOK, []models.DiceRollWithSender{})
	})

	r.GET("/room/:roomId/diceRolls/ws", func(c *gin.Context) {
		roomId := c.Param("roomId")
		hub := hubs[roomId]

		if hub == nil {
			hubs[roomId] = newHub()
			hub = hubs[roomId]
			go hub.run()
		}

		serveWs(hub, c.Writer, c.Request)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
