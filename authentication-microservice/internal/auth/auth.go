package auth

import (
	"fmt"
	"gin-authentication/internal/models"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// RegistrationInput represents the expected input for user registration
type RegistrationInput struct {
	Username string `json:"username" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"required,oneof=buyer seller"`
}

// LoginInput represents the expected input for user login
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// Register handles user registration
func Register(db *gorm.DB, c *gin.Context) {
	var input RegistrationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	// Hash the password
	hashedPassword, err := hashPassword(input.Password)
	if err != nil {
		log.Println("Password hashing failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password"})
		return
	}

	// Create the user
	user := models.User{
		Username: input.Username,
		Email:    input.Email,
		Password: hashedPassword,
		Role:     input.Role,
	}

	if err := db.Create(&user).Error; err != nil {
		// Check for unique constraint violations
		if isUniqueConstraintError(err) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Username or email already exists"})
			return
		}
		log.Println("Error creating user:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	// Respond with the created user details (excluding password)
	c.JSON(http.StatusCreated, gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"role":     user.Role,
	})
}

// Login handles user authentication
func Login(db *gorm.DB, c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	var user models.User
	if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		// To prevent user enumeration, use a generic error message
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare the provided password with the stored hashed password
	if err := comparePassword(user.Password, input.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// TODO: Implement token generation (e.g., JWT)
	token, err := generateToken(user)
	if err != nil {
		log.Println("Token generation failed:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// Respond with the token
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
	})
}

// hashPassword hashes the given password using bcrypt
func hashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// comparePassword compares a hashed password with a plain-text password
func comparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

// isUniqueConstraintError checks if the error is due to a unique constraint violation
func isUniqueConstraintError(err error) bool {
	// This is a simplistic check. You may need to parse the error message or error code
	// based on the database you're using.
	return err != nil && (gorm.ErrDuplicatedKey.Error() == err.Error() ||
		// Add other checks as necessary
		false)
}

func generateToken(user models.User) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "", fmt.Errorf("JWT_SECRET environment variable not set")
	}

	expirationTime := time.Now().Add(10 * 365 * 24 * time.Hour)

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
