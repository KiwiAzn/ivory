package main

import "example.com/diceRoom/models"

// Hub maintains the set of active clients and broadcasts messages to the clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan models.DiceRollWithSender

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// diceRolls
	diceRolls []string
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan models.DiceRollWithSender),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		diceRolls:  make([]models.DiceRollWithSender, 0),
	}
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
			h.diceRolls = append(h.diceRolls, string(message))

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
