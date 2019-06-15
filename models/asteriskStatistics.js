'use strict'

module.exports = (sequelize, DataTypes) => {
  const asterisk = sequelize.define('asterisk_statistics', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    date: {
      type: DataTypes.DATE
    },
    extension: {
      type: DataTypes.STRING
    },
    totalCalls: {
      type: DataTypes.BIGINT
    },
    totalTimeCalls: {
      type: DataTypes.BIGINT
    },
    totalReceivedCalls: {
      type: DataTypes.BIGINT
    },
    totalTimeReceivedCalls: {
      type: DataTypes.BIGINT
    },
    totalEmitedCalls: {
      type: DataTypes.BIGINT
    },
    totalTimeEmitedCalls: {
      type: DataTypes.BIGINT
    },
    total30sCalls: {
      type: DataTypes.BIGINT
    },
    totalDuration30sCalls: {
      type: DataTypes.BIGINT
    },
    lostCalls: {
      type: DataTypes.BIGINT
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  return asterisk
}
