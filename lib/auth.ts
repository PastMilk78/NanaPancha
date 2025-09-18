import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, LoginCredentials, AuthResponse, SessionData, AuditLog, LoginAttempt } from '@/types/auth'

// En producción, esto debería estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura'
const JWT_EXPIRES_IN = '24h'

// Simulación de base de datos en memoria (en producción usar una base de datos real)
const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@mesero-nana.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    lastLoginIP: '127.0.0.1'
  },
  {
    id: '2',
    username: 'mesero1',
    email: 'mesero1@mesero-nana.com',
    password: bcrypt.hashSync('mesero123', 10),
    role: 'mesero',
    isActive: true,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    lastLoginIP: '127.0.0.1'
  }
]

const sessions: Map<string, SessionData> = new Map()
const auditLogs: AuditLog[] = []
const loginAttempts: LoginAttempt[] = []

export class AuthService {
  // Obtener IP del cliente
  static getClientIP(req: any): string {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress || 
           'unknown'
  }

  // Obtener User Agent
  static getUserAgent(req: any): string {
    return req.headers['user-agent'] || 'unknown'
  }

  // Registrar intento de login
  static logLoginAttempt(username: string, ip: string, userAgent: string, success: boolean, failureReason?: string): void {
    const attempt: LoginAttempt = {
      id: Date.now().toString(),
      username,
      ip,
      userAgent,
      timestamp: new Date(),
      success,
      failureReason
    }
    loginAttempts.push(attempt)
    
    // Mantener solo los últimos 1000 intentos
    if (loginAttempts.length > 1000) {
      loginAttempts.splice(0, loginAttempts.length - 1000)
    }
  }

  // Registrar en auditoría
  static logAudit(userId: string, username: string, action: AuditLog['action'], ip: string, userAgent: string, success: boolean, details?: string): void {
    const log: AuditLog = {
      id: Date.now().toString(),
      userId,
      username,
      action,
      ip,
      userAgent,
      timestamp: new Date(),
      details,
      success
    }
    auditLogs.push(log)
  }

  // Verificar si hay actividad sospechosa
  static detectSuspiciousActivity(ip: string, username: string): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = []
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    // Intentos fallidos recientes desde la misma IP
    const recentFailedAttempts = loginAttempts.filter(
      attempt => attempt.ip === ip && 
                !attempt.success && 
                attempt.timestamp > oneHourAgo
    )
    
    if (recentFailedAttempts.length >= 5) {
      reasons.push(`Demasiados intentos fallidos (${recentFailedAttempts.length}) desde esta IP en la última hora`)
    }
    
    // Intentos fallidos recientes para el mismo usuario
    const recentFailedUserAttempts = loginAttempts.filter(
      attempt => attempt.username === username && 
                !attempt.success && 
                attempt.timestamp > oneHourAgo
    )
    
    if (recentFailedUserAttempts.length >= 3) {
      reasons.push(`Demasiados intentos fallidos para el usuario ${username} en la última hora`)
    }
    
    // Múltiples IPs para el mismo usuario en poco tiempo
    const userAttempts = loginAttempts.filter(
      attempt => attempt.username === username && 
                attempt.timestamp > oneHourAgo
    )
    
    const uniqueIPs = new Set(userAttempts.map(a => a.ip))
    if (uniqueIPs.size > 3) {
      reasons.push(`Usuario ${username} ha intentado acceder desde ${uniqueIPs.size} IPs diferentes en la última hora`)
    }
    
    return {
      suspicious: reasons.length > 0,
      reasons
    }
  }

  // Autenticar usuario
  static async authenticate(credentials: LoginCredentials, ip: string, userAgent: string): Promise<AuthResponse> {
    try {
      const user = users.find(u => u.username === credentials.username && u.isActive)
      
      if (!user) {
        this.logLoginAttempt(credentials.username, ip, userAgent, false, 'Usuario no encontrado')
        return {
          success: false,
          message: 'Credenciales inválidas'
        }
      }
      
      const isValidPassword = await bcrypt.compare(credentials.password, user.password)
      
      if (!isValidPassword) {
        this.logLoginAttempt(credentials.username, ip, userAgent, false, 'Contraseña incorrecta')
        return {
          success: false,
          message: 'Credenciales inválidas'
        }
      }
      
      // Verificar actividad sospechosa
      const suspiciousActivity = this.detectSuspiciousActivity(ip, credentials.username)
      
      if (suspiciousActivity.suspicious) {
        this.logLoginAttempt(credentials.username, ip, userAgent, false, `Actividad sospechosa: ${suspiciousActivity.reasons.join(', ')}`)
        this.logAudit(user.id, user.username, 'login_failed', ip, userAgent, false, `Actividad sospechosa detectada: ${suspiciousActivity.reasons.join(', ')}`)
        
        return {
          success: false,
          message: 'Se ha detectado actividad sospechosa. Contacta al administrador.'
        }
      }
      
      // Login exitoso
      this.logLoginAttempt(credentials.username, ip, userAgent, true)
      this.logAudit(user.id, user.username, 'login', ip, userAgent, true)
      
      // Actualizar información del usuario
      user.lastLoginAt = new Date()
      user.lastLoginIP = ip
      
      // Generar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          role: user.role,
          ip,
          loginTime: new Date()
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )
      
      // Crear sesión
      const session: SessionData = {
        userId: user.id,
        username: user.username,
        role: user.role,
        ip,
        userAgent,
        loginTime: new Date(),
        lastActivity: new Date()
      }
      
      sessions.set(token, session)
      
      return {
        success: true,
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          lastLoginIP: user.lastLoginIP
        }
      }
      
    } catch (error) {
      console.error('Error en autenticación:', error)
      return {
        success: false,
        message: 'Error interno del servidor'
      }
    }
  }

  // Verificar token
  static verifyToken(token: string): { valid: boolean; user?: any; error?: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      const session = sessions.get(token)
      
      if (!session) {
        return { valid: false, error: 'Sesión no encontrada' }
      }
      
      // Actualizar última actividad
      session.lastActivity = new Date()
      
      return { 
        valid: true, 
        user: {
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          ip: decoded.ip,
          loginTime: decoded.loginTime
        }
      }
    } catch (error) {
      return { valid: false, error: 'Token inválido o expirado' }
    }
  }

  // Cerrar sesión
  static logout(token: string, ip: string, userAgent: string): boolean {
    const session = sessions.get(token)
    if (session) {
      this.logAudit(session.userId, session.username, 'logout', ip, userAgent, true)
      sessions.delete(token)
      return true
    }
    return false
  }

  // Obtener logs de auditoría
  static getAuditLogs(limit: number = 100): AuditLog[] {
    return auditLogs.slice(-limit).reverse()
  }

  // Obtener intentos de login
  static getLoginAttempts(limit: number = 100): LoginAttempt[] {
    return loginAttempts.slice(-limit).reverse()
  }

  // Obtener estadísticas de seguridad
  static getSecurityStats() {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    
    const recentAttempts = loginAttempts.filter(a => a.timestamp > oneDayAgo)
    const failedAttempts = recentAttempts.filter(a => !a.success)
    const suspiciousIPs = new Set(failedAttempts.map(a => a.ip))
    
    return {
      totalAttempts24h: recentAttempts.length,
      failedAttempts24h: failedAttempts.length,
      successRate: recentAttempts.length > 0 ? ((recentAttempts.length - failedAttempts.length) / recentAttempts.length * 100).toFixed(2) : '0',
      suspiciousIPs: suspiciousIPs.size,
      uniqueUsers24h: new Set(recentAttempts.map(a => a.username)).size
    }
  }
}







