const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Message = require('./Message'); // Import the Message model

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'speaker'), // Ensure the ENUM includes 'speaker'
      defaultValue: 'user', // Default to 'user'
      allowNull: false, // Corrected the typo here
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
      defaultValue: null,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId' });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

module.exports = User;
