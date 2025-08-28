const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WhitelistCode = sequelize.define('WhitelistCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true,
    validate: {
      is: /^[A-Za-z0-9]{8,12}$/
    }
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  walletAddress: {
    type: DataTypes.STRING(42),
    allowNull: true,
    validate: {
      is: /^0x[a-fA-F0-9]{40}$/
    }
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['walletAddress']
    },
    {
      fields: ['isUsed']
    }
  ]
});

module.exports = WhitelistCode;