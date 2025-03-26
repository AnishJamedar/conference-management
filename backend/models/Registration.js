const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path to your Sequelize instance
const Registration = sequelize.define('Registration', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  ticket_type: {
    type: DataTypes.ENUM('general', 'vip', 'student'),
    allowNull: false,
    defaultValue: 'general',
  },
  payment_status: {
    type: DataTypes.ENUM('Pending', 'Paid'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  timestamps: true,
});


module.exports = Registration;