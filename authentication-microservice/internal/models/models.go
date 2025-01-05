package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID       uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	Username string    `gorm:"uniqueIndex" json:"username"`
	Email    string    `gorm:"uniqueIndex" json:"email"`
	Password string    `json:"password,omitempty"`                                   // Omitting password in JSON responses
	Role     string    `gorm:"type:varchar(10);not null;default:'user'" json:"role"` // New Role field with default
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}
