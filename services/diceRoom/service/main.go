package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	// Setup websockets
	hub := newHub()
	go hub.run()

	r.GET("/room/:roomId/diceRolls", func(c *gin.Context) {
		c.JSON(http.StatusOK, hub.diceRolls)
	})

	r.GET("/room/:roomId/diceRolls/ws", func(c *gin.Context) {
		serveWs(hub, c.Writer, c.Request)
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
