'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('asterisk_statistics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      date: {
        type: Sequelize.DATE
      },
      extension: {
        type: Sequelize.STRING
      },
      totalCalls: {
        type: Sequelize.BIGINT
      },
      totalTimeCalls: {
        type: Sequelize.BIGINT
      },
      totalReceivedCalls: {
        type: Sequelize.BIGINT
      },
      totalTimeReceivedCalls: {
        type: Sequelize.BIGINT
      },
      totalEmitedCalls: {
        type: Sequelize.BIGINT
      },
      totalTimeEmitedCalls: {
        type: Sequelize.BIGINT
      },
      total30sCalls: {
        type: Sequelize.BIGINT
      },
      totalDuration30sCalls: {
        type: Sequelize.BIGINT
      },
      lostCalls: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('asterisk_statistics')
  }
}
