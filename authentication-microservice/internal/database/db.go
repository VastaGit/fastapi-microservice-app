package database

import (
	"database/sql"
	models "gin-authentication/internal/models"
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

func InitDatabase() *gorm.DB {
	sqlDB, err := sql.Open("sqlite", "users.db")
	if err != nil {
		log.Fatal("Failed to open database: ", err)
	}

	// Use GORM to connect to the existing sql.DB
	db, err := gorm.Open(sqlite.New(sqlite.Config{
		Conn: sqlDB,
	}), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Auto-migrate the User model
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}

	log.Println("Database migrated successfully!")

	return db
}
