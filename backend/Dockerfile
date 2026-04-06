FROM golang:1.25-alpine

WORKDIR /app

# Instala o air para hot reload
RUN go install github.com/air-verse/air@latest

# Copiamos todos os arquivos da pasta backend para dentro do build
COPY . .

# Baixamos as dependências e o go mod tidy antes do air
RUN go mod tidy
RUN go mod download

# O resto dos arquivos serao mapeados via volume na maquina local
CMD ["sh", "-c", "go mod tidy && go mod download && air -c .air.toml"]
