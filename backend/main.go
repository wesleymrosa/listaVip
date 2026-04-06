package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

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

	DB.AutoMigrate(&Evento{}, &Convidado{})
}

// CORSMiddleware resolve os crachs na ponte React -> GO definindo headers agressivamente
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func main() {
	initDB()

	r := gin.Default()

	// Implementação Nativa e Absoluta de Headers 
	r.Use(CORSMiddleware())

	r.GET("/api/eventos", func(c *gin.Context) {
		var eventos []Evento
		DB.Find(&eventos)
		c.JSON(http.StatusOK, eventos)
	})

	r.GET("/api/eventos/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		idUint, _ := strconv.Atoi(idStr)
		
		var evento Evento
		if err := DB.Preload("Convidados").First(&evento, idUint).Error; err != nil {
			c.String(http.StatusNotFound, "Evento não encontrado")
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
			c.String(http.StatusBadRequest, "Todos os campos são obrigatórios")
			return
		}
		DB.Create(&novoEvento)
		c.JSON(http.StatusCreated, novoEvento)
	})

	r.POST("/api/eventos/:id/convidados", func(c *gin.Context) {
		idStr := c.Param("id")
		idUint, _ := strconv.Atoi(idStr)
		
		var evento Evento
		if err := DB.First(&evento, idUint).Error; err != nil {
			c.String(http.StatusNotFound, "Evento não encontrado")
			return
		}

		var novoConvidado Convidado
		if err := c.ShouldBindJSON(&novoConvidado); err != nil {
			c.String(http.StatusBadRequest, "Todos os campos são obrigatórios")
			return
		}
		
		novoConvidado.EventoID = evento.ID
		if err := DB.Create(&novoConvidado).Error; err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		
		c.JSON(http.StatusCreated, novoConvidado)
	})

	r.DELETE("/api/eventos/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		log.Printf("ID recebido para ação: [%s]", idStr)
		idUint, _ := strconv.Atoi(idStr)
		
		var evento Evento
		if err := DB.First(&evento, idUint).Error; err != nil {
			c.String(http.StatusNotFound, "Evento não encontrado")
			return
		}
		
		if err := DB.Unscoped().Delete(&evento, idUint).Error; err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusNoContent, nil) 
	})

	r.DELETE("/api/convidados/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		log.Printf("ID recebido para ação: [%s]", idStr)
		idUint, _ := strconv.Atoi(idStr)
		
		var convidado Convidado
		if err := DB.First(&convidado, idUint).Error; err != nil {
			c.String(http.StatusNotFound, "Convidado não encontrado")
			return
		}
		
		if err := DB.Unscoped().Delete(&convidado, idUint).Error; err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusNoContent, nil)
	})

	r.PUT("/api/eventos/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		log.Printf("ID recebido para ação: [%s]", idStr)
		idUint, _ := strconv.Atoi(idStr)
		
		var evento Evento
		if err := DB.First(&evento, idUint).Error; err != nil {
			c.String(http.StatusNotFound, "Evento não encontrado")
			return
		}

		var dadosNovos Evento
		if err := c.ShouldBindJSON(&dadosNovos); err != nil {
			c.String(http.StatusBadRequest, "Falha no parse JSON")
			return
		}
		
		if err := DB.Model(&evento).Updates(dadosNovos).Error; err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		
		c.JSON(http.StatusOK, evento)
	})

	r.PUT("/api/convidados/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		log.Printf("ID recebido para ação: [%s]", idStr)
		idUint, _ := strconv.Atoi(idStr)
		
		var convidado Convidado
		if err := DB.First(&convidado, idUint).Error; err != nil {
			c.String(http.StatusNotFound, "Convidado não encontrado")
			return
		}

		var dadosNovos Convidado
		if err := c.ShouldBindJSON(&dadosNovos); err != nil {
			c.String(http.StatusBadRequest, "Falha no parse JSON")
			return
		}
		
		if err := DB.Model(&convidado).Updates(dadosNovos).Error; err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		
		c.JSON(http.StatusOK, convidado)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
