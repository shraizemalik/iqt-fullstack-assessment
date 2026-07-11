import { apiClient } from './client'

export async function getTasks(params, signal) {
  const response = await apiClient.get('/tasks', {
    params,
    signal,
  })

  return response.data
}

export async function createTask(payload) {
  const response = await apiClient.post('/tasks', payload)
  return response.data
}

export async function updateTask(taskId, payload) {
  const response = await apiClient.put(`/tasks/${taskId}`, payload)
  return response.data
}

export async function deleteTask(taskId) {
  const response = await apiClient.delete(`/tasks/${taskId}`)
  return response.data
}
