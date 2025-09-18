# Plan para Repositorio del ChatBot

## Repositorio: `nana-pancha-chatbot`

### Estructura Propuesta
```
nana-pancha-chatbot/
├── src/
│   ├── whatsapp/
│   │   ├── bot.ts              # Bot principal de WhatsApp
│   │   ├── handlers/           # Manejadores de mensajes
│   │   ├── menu/               # Lógica del menú
│   │   └── order/              # Lógica de órdenes
│   ├── phone/
│   │   ├── twilio.ts           # Integración con Twilio
│   │   └── voice-handlers.ts   # Manejadores de voz
│   ├── api/
│   │   ├── client.ts           # Cliente para API principal
│   │   └── webhook.ts          # Webhook para recibir órdenes
│   ├── utils/
│   │   ├── logger.ts           # Sistema de logs
│   │   ├── database.ts         # Conexión a DB (solo para logs)
│   │   └── validation.ts       # Validaciones
│   └── types/
│       ├── whatsapp.ts         # Tipos de WhatsApp
│       ├── phone.ts            # Tipos de teléfono
│       └── api.ts              # Tipos de API
├── config/
│   ├── whatsapp.json           # Configuración del bot
│   ├── menu.json               # Menú para WhatsApp
│   └── responses.json          # Respuestas predefinidas
├── docs/
│   ├── setup.md                # Guía de configuración
│   ├── api.md                  # Documentación de API
│   └── deployment.md           # Guía de despliegue
├── tests/
│   ├── whatsapp.test.ts        # Tests del bot
│   └── api.test.ts             # Tests de API
├── package.json
├── .env.example
├── docker-compose.yml
└── README.md
```

## Tecnologías a Usar

### Core
- **Node.js + TypeScript**
- **Express.js** para API y webhooks
- **Baileys** para WhatsApp (biblioteca no oficial pero estable)
- **Twilio** para integración telefónica

### Base de Datos (Solo para logs del bot)
- **SQLite** o **PostgreSQL** para logs de conversaciones
- **Prisma** como ORM

### Comunicación
- **Axios** para llamadas HTTP a la API principal
- **WebSocket** para comunicación en tiempo real
- **Webhook** para recibir notificaciones

## Funcionalidades del ChatBot

### WhatsApp Bot
1. **Menú interactivo**
   - Mostrar categorías
   - Mostrar items con precios
   - Agregar al carrito
   - Ver carrito actual

2. **Proceso de orden**
   - Confirmar items
   - Solicitar información del cliente
   - Calcular total
   - Enviar orden a la API principal

3. **Seguimiento de órdenes**
   - Notificar cambios de estado
   - Tiempo estimado
   - Confirmación de entrega

### Integración Telefónica
1. **IVR (Interactive Voice Response)**
   - Menú de opciones por voz
   - Reconocimiento de voz
   - Confirmación de pedidos

2. **Agente virtual**
   - Procesamiento de lenguaje natural
   - Respuestas automáticas
   - Escalamiento a humano si es necesario

## API de Comunicación

### Endpoints que el ChatBot consumirá:
```typescript
// API Principal (NanaPancha)
POST /api/orders                    // Crear nueva orden
GET  /api/orders/:id                // Obtener orden
PUT  /api/orders/:id/status         // Actualizar estado
GET  /api/menu                      // Obtener menú
GET  /api/menu/categories           // Obtener categorías
```

### Webhooks que el ChatBot expondrá:
```typescript
// ChatBot expone estos endpoints
POST /webhook/whatsapp              // Recibir mensajes de WhatsApp
POST /webhook/phone                 // Recibir llamadas de Twilio
GET  /webhook/health                // Health check
```

## Configuración de Desarrollo

### Variables de Entorno
```env
# API Principal
MAIN_API_URL=http://localhost:3000/api
MAIN_API_KEY=tu-api-key-aqui

# WhatsApp
WHATSAPP_SESSION_PATH=./sessions
WHATSAPP_QR_TIMEOUT=60000

# Twilio
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Base de datos (para logs)
DATABASE_URL=sqlite:./chatbot.db

# Servidor
PORT=3001
NODE_ENV=development
```

### Comandos de Desarrollo
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Tests
npm test

# Linting
npm run lint
```

## Flujo de Comunicación

### 1. Cliente envía mensaje por WhatsApp
```
Cliente → WhatsApp → Baileys → ChatBot → API Principal → Base de Datos
```

### 2. API Principal notifica cambio de estado
```
API Principal → Webhook → ChatBot → WhatsApp → Cliente
```

### 3. Cliente llama por teléfono
```
Cliente → Twilio → ChatBot → API Principal → Base de Datos
```

## Implementación por Fases

### Fase 1: Estructura Base (1 semana)
- [ ] Configurar proyecto base
- [ ] Implementar cliente de API
- [ ] Configurar logging
- [ ] Tests básicos

### Fase 2: WhatsApp Bot (2 semanas)
- [ ] Integración con Baileys
- [ ] Menú interactivo
- [ ] Proceso de orden
- [ ] Manejo de estados

### Fase 3: Integración Telefónica (1 semana)
- [ ] Integración con Twilio
- [ ] IVR básico
- [ ] Procesamiento de voz

### Fase 4: Optimización (1 semana)
- [ ] Manejo de errores
- [ ] Logs y monitoreo
- [ ] Performance
- [ ] Documentación

## Consideraciones de Seguridad

1. **Autenticación**
   - API keys para comunicación entre servicios
   - JWT para sesiones de usuario
   - Rate limiting en webhooks

2. **Validación**
   - Validar todos los inputs
   - Sanitizar datos antes de enviar a API
   - Manejo seguro de números de teléfono

3. **Logs**
   - No guardar información sensible
   - Logs de auditoría
   - Rotación de logs

## Despliegue

### Opciones de Hosting
1. **Railway** (Recomendado)
   - Fácil despliegue
   - Base de datos incluida
   - Variables de entorno

2. **Render**
   - Similar a Railway
   - Buena para Node.js

3. **VPS**
   - Más control
   - Requiere más configuración

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## Monitoreo y Logs

### Métricas Importantes
- Mensajes procesados por minuto
- Tiempo de respuesta de API
- Errores de comunicación
- Órdenes creadas exitosamente

### Alertas
- API principal no disponible
- Errores de autenticación
- Tiempo de respuesta alto
- Fallos en webhooks

## Próximos Pasos Inmediatos

1. **Crear repositorio en GitHub**
2. **Configurar estructura base**
3. **Implementar cliente de API**
4. **Configurar Baileys para WhatsApp**
5. **Crear menú interactivo básico**

## Comandos para Crear el Repositorio

```bash
# Crear directorio
mkdir nana-pancha-chatbot
cd nana-pancha-chatbot

# Inicializar git
git init

# Crear estructura
mkdir -p src/{whatsapp,phone,api,utils,types}
mkdir -p config docs tests

# Inicializar npm
npm init -y

# Instalar dependencias básicas
npm install express baileys twilio axios prisma @prisma/client
npm install -D typescript @types/node @types/express ts-node nodemon

# Crear archivos básicos
touch .env.example
touch docker-compose.yml
touch README.md
```

Este plan te dará una base sólida para crear el ChatBot como un sistema independiente que se comunique eficientemente con la API principal.
