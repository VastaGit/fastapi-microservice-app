package main

import (
	auth "gin-authentication/internal/auth"
	database "gin-authentication/internal/database"
	models "gin-authentication/internal/models"

	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

type App struct {
	DB *gorm.DB
}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found. Proceeding with environment variables.")
		// You might choose to return here if .env is required
		// log.Fatal("Error loading .env file")
	}

	// Retrieve JWT_SECRET to ensure it's loaded correctly
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET environment variable not set")
	}

	db := database.InitDatabase()
	app := App{DB: db}

	router := gin.Default()

	// Add CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Vite's default port
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.POST("/register", func(c *gin.Context) {
		auth.Register(app.DB, c)
	})
	router.POST("/login", func(c *gin.Context) {
		auth.Login(app.DB, c)
	})
	router.GET("/users/:id", AuthMiddleware(), app.GetUser)
	router.GET("/users", AuthMiddleware(), app.GetAllUsers)

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")

		log.Println("Token:", tokenString)
		if tokenString == "" || len(tokenString) < 7 || tokenString[:7] != "Bearer " {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid token"})
			c.Abort()
			return
		}

		tokenString = tokenString[7:] // Убираем "Bearer "
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// GetAllUsers retrieves all users
func (app *App) GetAllUsers(c *gin.Context) {
	var users []models.User

	if err := app.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve users"})
		return
	}

	// Prepare response without passwords but including roles
	var response []gin.H
	for _, user := range users {
		response = append(response, gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role, // Include role
		})
	}

	c.JSON(http.StatusOK, response)
}

// GetUser retrieves a single user by ID
func (app *App) GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := app.DB.First(&user, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"role":     user.Role, // Include role
	})
}
