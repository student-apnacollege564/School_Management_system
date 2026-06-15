const API_BASE = 'http://localhost:8080/api'

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const text = await res.text()
      if (text) message = text
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getDashboardStats() {
    return request('/dashboard')
  },

  listStudents() {
    return request('/students')
  },
  createStudent(payload) {
    return request('/students', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateStudent(id, payload) {
    return request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteStudent(id) {
    return request(`/students/${id}`, { method: 'DELETE' })
  },

  listTeachers() {
    return request('/teachers')
  },
  createTeacher(payload) {
    return request('/teachers', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateTeacher(id, payload) {
    return request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteTeacher(id) {
    return request(`/teachers/${id}`, { method: 'DELETE' })
  },

  listParents() {
    return request('/parents')
  },
  createParent(payload) {
    return request('/parents', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateParent(id, payload) {
    return request(`/parents/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteParent(id) {
    return request(`/parents/${id}`, { method: 'DELETE' })
  },

  listTimetable() {
    return request('/timetable')
  },
  createTimetable(payload) {
    return request('/timetable', { method: 'POST', body: JSON.stringify(payload) })
  },
  updateTimetable(id, payload) {
    return request(`/timetable/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  deleteTimetable(id) {
    return request(`/timetable/${id}`, { method: 'DELETE' })
  },
}

