const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Update path as necessary

const Conference = sequelize.define('Conference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Conference', // Table name in the database
  timestamps: false, // Set this to true if you have createdAt and updatedAt columns in your table
});

module.exports = Conference;
