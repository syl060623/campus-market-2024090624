export interface LostFoundItem {
  id: number
  type: '丢失' | '拾到'
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
  status: 'active' | 'resolved' | 'deleted'
}
