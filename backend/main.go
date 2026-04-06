package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Evento struct {
	ID         uint        `gorm:"primaryKey" json:"id"`
	Nome       string      `json:"nome" binding:"required"`
	Local      string      `json:"local" binding:"required"`
	Data       string      `json:"data"`
	Horario    string      `json:"horario"`
	Convidados []Convidado `json:"convidados" gorm:"foreignKey:EventoID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type Convidado struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Nome     string `json:"nome" binding:"required"`
	RG       string `json:"rg" binding:"required"`
	EventoID uint   `json:"evento_id"`
}

var DB *gorm.DB

func initDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=db user=postgres password=postgres dbname=listavip port=5432 sslmode=disable TimeZone=UTC"
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Falha ao conectar no banco de dados:", err)
	}

	// Auto Migration com multiplas tabelas
	DB.AutoMigrate(&Evento{}, &Convidado{})
}

func main() {
	initDB()

	r := gin.Default()

	// Configurar CORS com regras explicitas
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept"},
	}))

	r.GET("/api/eventos", func(c *gin.Context) {
		var eventos []Evento
		DB.Find(&eventos)
		c.JSON(http.StatusOK, eventos)
	})

	r.GET("/api/eventos/:id", func(c *gin.Context) {
		id := c.Param("id")
		var evento Evento
		
		// O Preload puxa os convidados pela chave relacional e mescla na variavel array da struct
		if err := DB.Preload("Convidados").First(&evento, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Evento não encontrado"})
			return
		}
		
		c.JSON(http.StatusOK, gin.H{
			"evento":     evento,
			"convidados": evento.Convidados,
		})
	})

	r.POST("/api/eventos", func(c *gin.Context) {
		var novoEvento Evento
		if err := c.ShouldBindJSON(&novoEvento); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Todos os campos são obrigatórios"})
			return
		}
		DB.Create(&novoEvento)
		c.JSON(http.StatusCreated, novoEvento)
	})

	r.POST("/api/eventos/:id/convidados", func(c *gin.Context) {
		id := c.Param("id")
		log.Printf("[DEBUG] Tentativa de salvar convidado no evento parametro id: %s", id)
		
		var evento Evento
		if err := DB.First(&evento, id).Error; err != nil {
			log.Printf("[ERROR] Evento ID %s não encontrado no DB", id)
			c.JSON(http.StatusNotFound, gin.H{"error": "Evento não encontrado"})
			return
		}

		var novoConvidado Convidado
		if err := c.ShouldBindJSON(&novoConvidado); err != nil {
			log.Printf("[ERROR] Falha de sintaxe no JSON Bind: %v", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Todos os campos são obrigatórios"})
			return
		}
		
		log.Printf("[DEBUG] Convertendo convidado recebido formata: Nome=%s, RG=%s", novoConvidado.Nome, novoConvidado.RG)
		
		// Garantiu mapear corretamente a FK pelo ID extraido convertida da struct parente
		novoConvidado.EventoID = evento.ID
		
		if err := DB.Create(&novoConvidado).Error; err != nil {
			log.Printf("[ERROR] Erro ao persistir Convidado no banco de dados: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha na persistência de dados do convidado", "details": err.Error()})
			return
		}
		
		log.Printf("[DEBUG] Convidado inserido COM SUCESSO: ID Gerado=%d", novoConvidado.ID)
		c.JSON(http.StatusCreated, novoConvidado)
	})

	r.DELETE("/api/eventos/:id", func(c *gin.Context) {
		id := c.Param("id")
		
		var evento Evento
		if err := DB.First(&evento, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Evento não encontrado"})
			return
		}
		
		DB.Delete(&evento)
		c.JSON(http.StatusNoContent, nil) // 204
	})

	r.DELETE("/api/convidados/:id", func(c *gin.Context) {
		id := c.Param("id")
		
		var convidado Convidado
		if err := DB.First(&convidado, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Convidado não encontrado"})
			return
		}
		
		DB.Delete(&convidado)
		c.JSON(http.StatusNoContent, nil) // 204
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
