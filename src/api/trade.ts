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
  status: 'active' | 'sold' | 'deleted'
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function getTradeById(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}
