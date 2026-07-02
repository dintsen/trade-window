package ws

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
	"github.com/tradewindow/backend-go/internal/config"
	"github.com/tradewindow/backend-go/internal/protocol"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
)

type Client struct {
	Hub      *Hub
	Conn     *websocket.Conn
	Send     chan []byte
	Address  string
	ClientID string
	RoomID   string
}

func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		if c.Conn != nil {
			c.Conn.Close()
		}
	}()
	if c.Conn == nil {
		return
	} // for mock tests
	maxBytes := int64(16384)
	if config.AppConfig != nil {
		maxBytes = config.AppConfig.MaxWSMessageBytes
	}
	c.Conn.SetReadLimit(maxBytes)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error { c.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		if int64(len(message)) > maxBytes {
			c.SendError(protocol.ErrMessageTooLong, "WebSocket message exceeds configured size limit")
			continue
		}
		var msg protocol.WSMessage
		if err := json.Unmarshal(message, &msg); err != nil {
			c.SendError(protocol.ErrInvalidJSON, "Malformed JSON")
			continue
		}
		c.Hub.ProcessMessage(c, msg)
	}
}

func (c *Client) WritePump() {
	if c.Conn == nil {
		return
	} // for mock tests
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (c *Client) SendJSON(msgType string, payload interface{}) {
	var raw json.RawMessage
	if payload != nil {
		b, _ := json.Marshal(payload)
		raw = b
	}
	msg := protocol.WSMessage{
		Type:    msgType,
		Payload: raw,
	}
	b, _ := json.Marshal(msg)
	select {
	case c.Send <- b:
	default:
	}
}

func (c *Client) SendError(code string, text string) {
	c.SendJSON("trade:error", protocol.ErrorPayload{
		Code:        code,
		Message:     text,
		Recoverable: true,
	})
}
