
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    projectChargeCode: DataTypes.STRING,
    clientName: DataTypes.STRING,
    projectName: DataTypes.STRING,
    projectInformation: DataTypes.STRING,
    assignedUsers: DataTypes.STRING,
    assignedDays: DataTypes.NUMBER,
    startDate: DataTypes.TEXT,
    endDate: DataTypes.TEXT
  })

  Project.associate = function (models) {
  }

  return Project
}