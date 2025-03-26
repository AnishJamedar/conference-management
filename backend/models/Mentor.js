const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update path as necessary

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  conference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false, // Disable createdAt and updatedAt
});

module.exports = Mentor;

