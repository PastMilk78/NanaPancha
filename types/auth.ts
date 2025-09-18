export interface User {
  id: string
  username: string
  email: string
  password: string
  role: 'admin' | 'mesero' | 'cocinero'
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
  lastLoginIP?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: Omit<User, 'password'>
}

export interface SessionData {
  userId: string
  username: string
  role: string
  ip: string
  userAgent: string
  loginTime: Date
  lastActivity: Date
}

export interface AuditLog {
  id: string
  userId: string
  username: string
  action: 'login' | 'logout' | 'login_failed' | 'user_created' | 'user_modified' | 'user_deleted'
  ip: string
  userAgent: string
  timestamp: Date
  details?: string
  success: boolean
}

export interface LoginAttempt {
  id: string
  username: string
  ip: string
  userAgent: string
  timestamp: Date
  success: boolean
  failureReason?: string
}







