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
	r.GET("/room/:roomId/diceRolls", func(c *gin.Context) {
		roomId := c.Param("roomId")
		c.JSON(http.StatusOK, gin.H{
			"roomId": roomId,
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
