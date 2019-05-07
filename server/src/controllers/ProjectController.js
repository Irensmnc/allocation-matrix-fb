const {Project} = require('../models');

module.exports = {
  async index (req, res) {
    try {
      let projects = null;
      const search = req.query.search;
      if (search) {
        projects = await Project.findAll({
          where: {
            $or: [
              'assignedUsers', 'cc', 'clientName', 'content', 'endDate', 'name', 'startDate'
            ].map(key => ({
              [key]: {
                $like: `%${search}%`
              }
            }))
          }
        })
      } else {
        projects = await Project.findAll({
          limit: 10
        })
      }
      res.send(projects)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occurred trying to fetch the projects'
      })
    }
  },
  async show (req, res) {
    try {
      const project = await Project.findById(req.params.projectId);
      res.send(project)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the projects'
      })
    }
  },
  async post (req, res) {
    try {
      const project = await Project.create(req.body);
      res.send(project)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the project'
      })
    }
  },
  async put (req, res) {
    try {
      await Project.update(req.body, {
        where: {
          id: req.params.projectId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the project'
      })
    }
  }
}