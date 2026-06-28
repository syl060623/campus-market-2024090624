import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message } from '@/types/message'

export const useMessageStore = defineStore('message', () => {
  let nextConvId = 5
  const conversations = ref<Conversation[]>([
    {
      id: 1, userId: 2, userName: '李思思', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
      lastMessage: '好的，那明天下午三点在图书馆门口见？', lastMessageTime: '10:32', unreadCount: 0,
      relatedItemId: 1, relatedItemTitle: '出闲置教材《软件工程导论》', relatedItemImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=200&fit=crop'
    },
    {
      id: 2, userId: 3, userName: '王强', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang',
      lastMessage: '书还在吗？我想买', lastMessageTime: '昨天', unreadCount: 2,
      relatedItemId: 2, relatedItemTitle: '出售高数第六版教材', relatedItemImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop'
    },
    {
      id: 3, userId: 4, userName: '赵敏', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin',
      lastMessage: '拼单还差一个人，你要来吗？', lastMessageTime: '15:20', unreadCount: 1,
      relatedItemId: 3, relatedItemTitle: '东区食堂三楼拼奶茶', relatedItemImage: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=200&h=200&fit=crop'
    },
    {
      id: 4, userId: 5, userName: '陈晨', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenchen',
      lastMessage: '谢谢你帮我取了快递！', lastMessageTime: '昨天', unreadCount: 0,
      relatedItemId: 4, relatedItemTitle: '求帮取快递到6栋宿舍', relatedItemImage: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=200&h=200&fit=crop'
    }
  ])

  const currentConversationId = ref<number | null>(1)
  const messages = ref<Record<number, Message[]>>({
    1: [
      { id: 1, conversationId: 1, senderId: 2, senderName: '李思思', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', content: '你好，请问《软件工程导论》这本书还在吗？', type: 'text', createdAt: '10:15' },
      { id: 2, conversationId: 1, senderId: 1, senderName: '我', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming', content: '在的，九成新，原价59元，现在35元出', type: 'text', createdAt: '10:18' },
      { id: 3, conversationId: 1, senderId: 2, senderName: '李思思', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', content: '价格可以接受，能看看实物照片吗？', type: 'text', createdAt: '10:20' },
      { id: 4, conversationId: 1, senderId: 1, senderName: '我', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming', content: '可以，我拍几张发给你', type: 'text', createdAt: '10:22' },
      { id: 5, conversationId: 1, senderId: 1, senderName: '我', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming', content: '[图片]', type: 'image', createdAt: '10:23' },
      { id: 6, conversationId: 1, senderId: 2, senderName: '李思思', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', content: '看起来很新！我买了，怎么交易？', type: 'text', createdAt: '10:25' },
      { id: 7, conversationId: 1, senderId: 1, senderName: '我', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming', content: '明天下午三点图书馆门口见面可以吗？', type: 'text', createdAt: '10:28' },
      { id: 8, conversationId: 1, senderId: 2, senderName: '李思思', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi', content: '好的，那明天下午三点在图书馆门口见？', type: 'text', createdAt: '10:32' }
    ],
    2: [
      { id: 1, conversationId: 2, senderId: 3, senderName: '王强', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang', content: '书还在吗？我想买', type: 'text', createdAt: '昨天' }
    ],
    3: [
      { id: 1, conversationId: 3, senderId: 4, senderName: '赵敏', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin', content: '拼单还差一个人，你要来吗？', type: 'text', createdAt: '15:20' }
    ],
    4: [
      { id: 1, conversationId: 4, senderId: 1, senderName: '我', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming', content: '快递已经放在你宿舍楼下了', type: 'text', createdAt: '昨天' },
      { id: 2, conversationId: 4, senderId: 5, senderName: '陈晨', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenchen', content: '谢谢你帮我取了快递！', type: 'text', createdAt: '昨天' }
    ]
  })
  const currentConversation = computed(() => {
    return conversations.value.find(c => c.id === currentConversationId.value) || null
  })

  const currentMessages = computed(() => {
    if (!currentConversationId.value) return []
    return messages.value[currentConversationId.value] || []
  })

  const totalUnreadCount = computed(() => {
    return conversations.value.reduce((sum, c) => sum + c.unreadCount, 0)
  })

  function selectConversation(id: number) {
    currentConversationId.value = id
    const conv = conversations.value.find(c => c.id === id)
    if (conv) conv.unreadCount = 0
  }

  function sendMessage(content: string) {
    if (!currentConversationId.value || !content.trim()) return
    const convId = currentConversationId.value
    if (!messages.value[convId]) messages.value[convId] = []
    const newMsg: Message = {
      id: Date.now(),
      conversationId: convId,
      senderId: 1,
      senderName: '我',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
      content: content.trim(),
      type: 'text',
      createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    messages.value[convId].push(newMsg)
    const conv = conversations.value.find(c => c.id === convId)
    if (conv) {
      conv.lastMessage = content.trim()
      conv.lastMessageTime = '刚刚'
    }
  }

  function getOrCreateConversation(userId: number): Conversation {
    const existing = conversations.value.find(c => c.userId === userId)
    if (existing) return existing
    const newConv: Conversation = {
      id: nextConvId++,
      userId,
      userName: `用户${userId}`,
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${userId}`,
      lastMessage: '开始聊天吧',
      lastMessageTime: '刚刚',
      unreadCount: 0
    }
    conversations.value.push(newConv)
    messages.value[newConv.id] = []
    return newConv
  }

  return { conversations, currentConversationId, currentConversation, currentMessages, totalUnreadCount, selectConversation, sendMessage, getOrCreateConversation }
})
