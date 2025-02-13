const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define(
  'User',
  {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
    },
  },
  {
    timestamps: true, // Habilita los campos `createdAt` y `updatedAt`
    tableName: 'users', // Nombre de la tabla en la base de datos
  }
);

module.exports = User;
