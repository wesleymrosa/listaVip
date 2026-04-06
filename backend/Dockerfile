FROM golang:1.25-alpine
WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["sh", "-c", "go mod tidy && air -c .air.toml"]
