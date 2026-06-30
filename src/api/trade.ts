import http from './http'

export interface TradeItem {
  id: number
  title: string
  category: string
  price: number
  originalPrice: number
  condition: string
  images: string[]
  description: string
  location: string
  contact: string
  publisherId: number
  publisherName: string
  publisherAvatar: string
  createdAt: string
  status: string
  publisher: string
  publishTime: string
  image: string
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function getTradeById(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}

export function createTrade(data: Partial<Omit<TradeItem, 'id'>>) {
  return http.post<TradeItem>('/trades', data)
}

export function deleteTrade(id: number) {
  return http.delete(`/trades/${id}`)
}

export function updateTrade(id: number, data: Partial<Omit<TradeItem, 'id'>>) {
  return http.patch<TradeItem>(`/trades/${id}`, data)
}

