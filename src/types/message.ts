export interface Message {
  id: number
  conversationId: number
  senderId: number
  senderName: string
  senderAvatar: string
  content: string
  type: 'text' | 'image' | 'system'
  createdAt: string
}

export interface Conversation {
  id: number
  userId: number
  userName: string
  userAvatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  relatedItemId?: number
  relatedItemTitle?: string
  relatedItemImage?: string
}

