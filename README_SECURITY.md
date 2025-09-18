# Sistema de Seguridad y Autenticación - Mesero Nana

## 🛡️ Características de Seguridad Implementadas

### 1. **Autenticación con JWT**
- Tokens JWT seguros con expiración configurable
- Almacenamiento seguro en localStorage
- Verificación automática de tokens

### 2. **Registro de IP y Auditoría**
- **Registro de IP**: Cada login se registra con la IP del usuario
- **User Agent**: Se captura el navegador y sistema operativo
- **Timestamp**: Registro preciso de fecha y hora de cada acción
- **Geolocalización**: Se puede extender para incluir ubicación geográfica

### 3. **Detección de Actividad Sospechosa**
- **Múltiples intentos fallidos**: Bloqueo después de 5 intentos fallidos desde la misma IP
- **Ataques de fuerza bruta**: Bloqueo después de 3 intentos fallidos para el mismo usuario
- **Múltiples IPs**: Alerta si un usuario accede desde más de 3 IPs diferentes en una hora
- **Análisis de patrones**: Detección automática de comportamientos anómalos

### 4. **Sistema de Roles y Permisos**
- **Admin**: Acceso completo al sistema, incluyendo panel de seguridad
- **Mesero**: Acceso al sistema de pedidos
- **Cocinero**: Acceso limitado según necesidades

### 5. **Panel de Administración de Seguridad**
- **Dashboard en tiempo real**: Estadísticas de seguridad
- **Logs de auditoría**: Historial completo de todas las acciones
- **Intentos de login**: Monitoreo de intentos exitosos y fallidos
- **Alertas de seguridad**: Notificaciones de actividad sospechosa

## 🚀 Instalación y Configuración

### 1. **Instalar Dependencias**
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 2. **Configurar Variables de Entorno**
Crear un archivo `.env.local` en la raíz del proyecto:
```env
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
JWT_EXPIRES_IN=24h
MAX_LOGIN_ATTEMPTS_PER_IP=5
MAX_LOGIN_ATTEMPTS_PER_USER=3
MAX_IPS_PER_USER_PER_HOUR=3
```

### 3. **Credenciales de Prueba**
- **Admin**: usuario: `admin`, contraseña: `admin123`
- **Mesero**: usuario: `mesero1`, contraseña: `mesero123`

## 📊 Funcionalidades del Sistema

### **Login y Autenticación**
- Formulario de login seguro con validación
- Captura automática de IP y User Agent
- Verificación de credenciales con bcrypt
- Generación de tokens JWT

### **Protección de Rutas**
- Componente `ProtectedRoute` para proteger páginas
- Verificación automática de autenticación
- Redirección automática a login si no está autenticado
- Verificación de roles para acceso específico

### **Header con Información del Usuario**
- Muestra información del usuario autenticado
- Indicador de estado de conexión
- Menú desplegable con opciones
- Función de logout seguro

### **Panel de Seguridad (Solo Admin)**
- Estadísticas en tiempo real
- Logs de auditoría detallados
- Monitoreo de intentos de login
- Detección de amenazas

## 🔒 Medidas de Seguridad Implementadas

### **Contra Ataques de Fuerza Bruta**
- Límite de intentos fallidos por IP
- Límite de intentos fallidos por usuario
- Bloqueo temporal automático

### **Contra Ataques de Credential Stuffing**
- Detección de múltiples IPs para el mismo usuario
- Análisis de patrones de acceso
- Alertas de actividad sospechosa

### **Contra Ataques de Session Hijacking**
- Tokens JWT con expiración
- Verificación de IP en cada sesión
- Logout automático por inactividad

### **Auditoría y Monitoreo**
- Registro completo de todas las acciones
- Trazabilidad de usuarios y IPs
- Alertas en tiempo real
- Reportes de seguridad

## 📱 Uso del Sistema

### **Para Usuarios Regulares**
1. Navegar a `/login`
2. Ingresar credenciales
3. Acceder al sistema principal
4. Usar el menú de usuario para cerrar sesión

### **Para Administradores**
1. Acceder con credenciales de admin
2. Navegar a `/security` para el panel de seguridad
3. Monitorear logs y estadísticas
4. Revisar alertas de seguridad

## 🚨 Alertas de Seguridad

### **Tipos de Alertas**
- **IP Sospechosa**: Múltiples intentos fallidos desde la misma IP
- **Usuario Comprometido**: Múltiples intentos fallidos para el mismo usuario
- **Múltiples IPs**: Usuario accediendo desde muchas IPs diferentes
- **Patrones Anómalos**: Comportamiento fuera de lo normal

### **Acciones Automáticas**
- Bloqueo temporal de IPs sospechosas
- Notificación a administradores
- Registro en logs de seguridad
- Incremento de nivel de alerta

## 🔧 Personalización y Extensión

### **Configuración de Límites**
- Ajustar límites de intentos fallidos
- Configurar tiempos de bloqueo
- Personalizar reglas de detección

### **Integración con Sistemas Externos**
- Base de datos real (PostgreSQL, MySQL)
- Servicios de geolocalización
- Sistemas de notificación (email, SMS)
- Integración con SIEM

### **Funcionalidades Adicionales**
- Autenticación de dos factores (2FA)
- Login con redes sociales
- Verificación por email
- Recuperación de contraseñas

## 📈 Métricas y Reportes

### **Estadísticas Disponibles**
- Total de intentos de login (24h)
- Tasa de éxito de login
- IPs sospechosas detectadas
- Usuarios únicos activos
- Sesiones activas

### **Reportes de Seguridad**
- Logs de auditoría exportables
- Historial de alertas
- Análisis de tendencias
- Reportes de cumplimiento

## 🛠️ Mantenimiento y Monitoreo

### **Tareas Diarias**
- Revisar logs de auditoría
- Verificar alertas de seguridad
- Monitorear estadísticas
- Revisar IPs bloqueadas

### **Tareas Semanales**
- Análisis de patrones de acceso
- Revisión de usuarios inactivos
- Actualización de reglas de seguridad
- Backup de logs

### **Tareas Mensuales**
- Revisión de políticas de seguridad
- Análisis de tendencias
- Actualización de documentación
- Revisión de permisos de usuario

## 🔮 Futuras Mejoras

### **Funcionalidades Planificadas**
- Dashboard de seguridad en tiempo real
- Notificaciones push para alertas críticas
- Integración con servicios de threat intelligence
- Machine learning para detección de amenazas

### **Mejoras de Seguridad**
- Autenticación biométrica
- Análisis de comportamiento del usuario
- Detección de malware en el navegador
- Protección contra ataques de phishing

---

## 📞 Soporte y Contacto

Para soporte técnico o preguntas sobre el sistema de seguridad:
- Revisar logs del sistema
- Consultar documentación técnica
- Contactar al equipo de desarrollo

---

**⚠️ IMPORTANTE**: Este sistema está diseñado para desarrollo y pruebas. Para uso en producción, asegúrate de:
- Cambiar todas las claves secretas
- Configurar una base de datos real
- Implementar HTTPS
- Configurar firewalls y medidas de seguridad adicionales
- Realizar auditorías de seguridad regulares







