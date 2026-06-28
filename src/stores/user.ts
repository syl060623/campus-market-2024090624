import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginParams, RegisterParams } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    id: 1,
    nickname: '张明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangming',
    email: 'zhangming@campus.edu',
    phone: '138****6789',
    campus: '主校区',
    college: '计算机科学与技术学院',
    creditScore: 92,
    isLoggedIn: true,
    createdAt: '2025-09-01'
  })

  const isLoggedIn = computed(() => user.value.isLoggedIn)
  const nickname = computed(() => user.value.nickname)
  const avatar = computed(() => user.value.avatar)
  const creditScore = computed(() => user.value.creditScore)

  function login(params: LoginParams) {
    user.value.isLoggedIn = true
    user.value.phone = params.phone
    user.value.nickname = '李华'
  }

  function register(params: RegisterParams) {
    user.value = {
      id: Date.now(),
      nickname: params.nickname,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=newuser',
      email: '',
      phone: params.phone,
      campus: params.campus,
      college: params.college,
      creditScore: 80,
      isLoggedIn: true,
      createdAt: new Date().toISOString().split('T')[0]
    }
  }

  function logout() {
    user.value.isLoggedIn = false
  }

  function updateProfile(data: Partial<User>) {
    Object.assign(user.value, data)
  }

  return { user, isLoggedIn, nickname, avatar, creditScore, login, register, logout, updateProfile }
})
