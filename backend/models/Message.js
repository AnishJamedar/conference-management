const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, 
});

module.exports = Message;