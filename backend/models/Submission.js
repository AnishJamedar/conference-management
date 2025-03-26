const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const Submission = sequelize.define('Submission', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conference_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Submission;