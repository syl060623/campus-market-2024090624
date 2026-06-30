import http from './http'

export interface LostFoundItem {
  id: number
  type: string
  itemName: string
  images: string[]
  description: string
  location: string
  happenedAt: string
  contact: string
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: string
  title: string
  eventTime: string
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function getLostFoundById(id: number) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

export function createLostFound(data: Partial<Omit<LostFoundItem, 'id'>>) {
  return http.post<LostFoundItem>('/lostFounds', data)
}

export function deleteLostFound(id: number) {
  return http.delete(`/lostFounds/${id}`)
}

export function updateLostFound(id: number, data: Partial<Omit<LostFoundItem, 'id'>>) {
  return http.patch<LostFoundItem>(`/lostFounds/${id}`, data)
}

