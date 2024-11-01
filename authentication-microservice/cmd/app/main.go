package main

import (
	auth "gin-authentication/internal/auth"
	database "gin-authentication/internal/database"
	models "gin-authentication/internal/models"

	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

type App struct {
	DB *gorm.DB
}

func main() {
	db := database.InitDatabase()
	app := App{DB: db}

	router := gin.Default()
	router.POST("/register", func(c *gin.Context) {
		auth.Register(app.DB, c)
	})
	router.POST("/login", func(c *gin.Context) {
		auth.Login(app.DB, c)
	})
	// router.GET("/users/:id", app.GetUser)
	router.GET("/users", app.GetAllUsers)

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}

}

// GetAllUsers retrieves all users
func (app *App) GetAllUsers(c *gin.Context) {
	var users []models.User

	if err := app.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve users"})
		return
	}

	// Prepare response without passwords
	var response []gin.H
	for _, user := range users {
		response = append(response, gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		})
	}

	c.JSON(http.StatusOK, response)
}
