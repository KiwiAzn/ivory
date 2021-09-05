FROM golang:1.17-alpine as depdendences
WORKDIR /app
COPY services/diceRoom ./
RUN go mod download

RUN go build -o /dice-room

EXPOSE 8080

CMD ["/dice-room"]
