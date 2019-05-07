
import Api from '@/services/Api'

export default {
  index (search) {
    return Api().get('projects', {
      params: {
        search: search
      }
    })
  },
  show (projectId) {
    return Api().get(`project/${projectId}`)
  },
  post (project) {
    return Api().post('projects', project)
  },
  put (project) {
    return Api().put(`projects/${project.id}`, project)
  }
}