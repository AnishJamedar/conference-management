const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Submission = require('./Submission');

const Review = sequelize.define('Review', {
  submission_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Submission,
      key: 'id',
    },
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending Review', 
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Review;