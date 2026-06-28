export interface User {
  id: number
  nickname: string
  avatar: string
  email: string
  phone: string
  campus: string
  college: string
  creditScore: number
  isLoggedIn: boolean
  createdAt: string
}

export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  nickname: string
  phone: string
  password: string
  campus: string
  college: string
}
