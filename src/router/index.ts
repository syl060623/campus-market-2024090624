import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/search', name: 'Search', component: () => import('../views/SearchView.vue') },
  { path: '/trade', name: 'Trade', component: () => import('../views/TradeView.vue') },
  { path: '/trade/:id', name: 'ItemDetail', component: () => import('../views/ItemDetailView.vue') },
  { path: '/lost-found', name: 'LostFound', component: () => import('../views/LostFoundView.vue') },
  { path: '/lost-found/:id', name: 'LostDetail', component: () => import('../views/LostDetailView.vue') },
  { path: '/group-buy', name: 'GroupBuy', component: () => import('../views/GroupBuyView.vue') },
  { path: '/group-buy/:id', name: 'GroupDetail', component: () => import('../views/GroupDetailView.vue') },
  { path: '/errand', name: 'Errand', component: () => import('../views/ErrandView.vue') },
  { path: '/errand/:id', name: 'TaskDetail', component: () => import('../views/TaskDetailView.vue') },
  { path: '/publish', name: 'Publish', component: () => import('../views/PublishView.vue') },
  { path: '/publish/item', name: 'PublishItem', component: () => import('../views/PublishItemView.vue') },
  { path: '/publish/lost', name: 'PublishLost', component: () => import('../views/PublishLostView.vue') },
  { path: '/publish/group', name: 'PublishGroup', component: () => import('../views/PublishGroupView.vue') },
  { path: '/publish/task', name: 'PublishTask', component: () => import('../views/PublishTaskView.vue') },
  { path: '/messages', name: 'Messages', component: () => import('../views/MessagesView.vue') },
  { path: '/chat/:userId', name: 'Chat', component: () => import('../views/ChatView.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../views/ProfileView.vue') },
  { path: '/profile/posts', name: 'MyPosts', component: () => import('../views/MyPostsView.vue') },
  { path: '/profile/favorites', name: 'Favorites', component: () => import('../views/FavoritesView.vue') },
  { path: '/profile/settings', name: 'Settings', component: () => import('../views/SettingsView.vue') },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: '登录',
    },
  },
  { path: '/user', name: 'UserCenter', component: () => import('../views/UserCenterView.vue') },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      title: '注册',
    },
  },
  { path: '/admin', name: 'AdminDashboard', component: () => import('../views/AdminDashboardView.vue') },
  { path: '/admin/review', name: 'AdminReview', component: () => import('../views/AdminReviewView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
