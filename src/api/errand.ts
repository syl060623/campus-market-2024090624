import http from './http'

export interface ErrandTask {
  id: number
  title: string
  type: string
  content: string
  description: string
  reward: number
  images: string[]
  deliveryLocation: string
  expectedTime: string
  contact: string
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: string
  taskType: string
  from: string
  to: string
  deadline: string
  publisher: string
  takerId?: number
  takerName?: string
}

export function getErrands() {
  return http.get<ErrandTask[]>('/errands')
}

export function getErrandById(id: number) {
  return http.get<ErrandTask>(`/errands/${id}`)
}

export function createErrand(data: Partial<Omit<ErrandTask, 'id'>>) {
  return http.post<ErrandTask>('/errands', data)
}

export function deleteErrand(id: number) {
  return http.delete(`/errands/${id}`)
}

export function updateErrand(id: number, data: Partial<Omit<ErrandTask, 'id'>>) {
  return http.patch<ErrandTask>(`/errands/${id}`, data)
}

