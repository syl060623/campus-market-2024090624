import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TradeItem } from '@/types/item'
import type { LostFoundItem } from '@/types/lost'
import type { GroupBuyItem } from '@/types/group'
import type { ErrandTask } from '@/types/task'
import {
  tradeItems as mockTradeItems,
  lostItems as mockLostItems,
  groupItems as mockGroupItems,
  errandTasks as mockErrandTasks,
  myPublishedPosts as mockPosts,
  allItemsForFavorites as mockFavorites
} from '@/mock/data'

export const useItemStore = defineStore('item', () => {
  const tradeItems = ref<TradeItem[]>([...mockTradeItems])
  const lostItems = ref<LostFoundItem[]>([...mockLostItems])
  const groupItems = ref<GroupBuyItem[]>([...mockGroupItems])
  const errandTasks = ref<ErrandTask[]>([...mockErrandTasks])
  const myPublishedPosts = ref<any[]>([...mockPosts])
  const allItemsForFavorites = ref<any[]>([...mockFavorites])

  function addTradeItem(item: TradeItem) {
    tradeItems.value.push(item)
    addPost({ title: item.title, type: '二手交易', status: 'active', time: item.createdAt, price: item.price })
  }

  function addLostItem(item: LostFoundItem) {
    lostItems.value.push(item)
    addPost({ title: item.itemName, type: '失物招领', status: 'active', time: item.createdAt })
  }

  function addGroupItem(item: GroupBuyItem) {
    groupItems.value.push(item)
    addPost({ title: item.title, type: '拼单搭子', status: 'active', time: item.createdAt, currentCount: 1, targetCount: item.targetCount })
  }

  function addErrandTask(item: ErrandTask) {
    errandTasks.value.push(item)
    addPost({ title: item.title, type: '跑腿委托', status: 'active', time: item.createdAt, reward: item.reward })
  }

  function addPost(post: any) {
    post.id = Date.now()
    myPublishedPosts.value.push(post)
  }

  return {
    tradeItems, lostItems, groupItems, errandTasks, myPublishedPosts, allItemsForFavorites,
    addTradeItem, addLostItem, addGroupItem, addErrandTask
  }
})
