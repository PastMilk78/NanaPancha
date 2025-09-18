# Arquitectura del Sistema NanaPancha

## Estado Actual del Proyecto

### ✅ Lo que tenemos funcionando:
- Sistema de meseros con menú interactivo
- Dashboard de administración con filtros
- Simulador de comandas (WhatsApp/teléfono)
- Autenticación y roles
- Persistencia local (LocalStorage)

### ❌ Limitaciones actuales:
- Sin base de datos real
- Simulador no genera registros reales
- No hay integración real con WhatsApp
- Escalabilidad limitada

## Arquitectura Propuesta

### 1. **Repositorio Principal (NanaPancha)**
```
nana-pancha/
├── frontend/          # Interfaz de meseros y admin
├── backend/           # API REST + Base de datos
├── shared/            # Tipos y utilidades compartidas
└── docs/              # Documentación
```

### 2. **Repositorio Separado (ChatBot)**
```
nana-pancha-chatbot/
├── whatsapp-bot/      # Bot de WhatsApp
├── phone-integration/ # Integración telefónica
├── api-client/        # Cliente para comunicarse con la API principal
└── docs/              # Documentación del bot
```

## Stack Tecnológico Recomendado

### Backend (API Principal)
- **Node.js + Express** o **Next.js API Routes**
- **PostgreSQL** o **MongoDB** para base de datos
- **Prisma** o **TypeORM** como ORM
- **JWT** para autenticación
- **WebSockets** para actualizaciones en tiempo real

### Frontend (Actual)
- **Next.js 14** (mantener)
- **TypeScript** (mantener)
- **Tailwind CSS** (mantener)
- **React Query** o **SWR** para manejo de estado del servidor

### ChatBot (Nuevo Repositorio)
- **Node.js + Express**
- **WhatsApp Business API** o **Baileys** (biblioteca de WhatsApp)
- **Twilio** para integración telefónica
- **Webhook** para comunicarse con la API principal

## Plan de Implementación

### Fase 1: Base de Datos y API (1-2 semanas)
1. **Configurar base de datos**
   - PostgreSQL con Docker
   - Esquema de tablas (users, orders, menu_items, etc.)
   - Migraciones con Prisma

2. **Crear API REST**
   - Endpoints para órdenes
   - Endpoints para menú
   - Endpoints para usuarios
   - Autenticación JWT

3. **Migrar frontend**
   - Reemplazar LocalStorage con llamadas a API
   - Implementar React Query para cache
   - Manejo de estados de carga y error

### Fase 2: ChatBot Separado (2-3 semanas)
1. **Crear repositorio independiente**
   - Bot de WhatsApp con Baileys
   - Integración con Twilio para llamadas
   - Webhook para enviar órdenes a la API principal

2. **Comunicación entre sistemas**
   - API endpoints para recibir órdenes del bot
   - WebSocket para notificaciones en tiempo real
   - Logs y monitoreo

### Fase 3: Mejoras y Optimización (1 semana)
1. **Notificaciones en tiempo real**
2. **Reportes y analytics**
3. **Optimización de performance**
4. **Testing y documentación**

## Estructura de Base de Datos Propuesta

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'mesero', 'cocinero')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  last_login_ip INET
);

-- Categorías del menú
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Items del menú
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES menu_categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Modificadores
CREATE TABLE modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('additive', 'subtractive', 'option')),
  price_per_unit DECIMAL(10,2) DEFAULT 0,
  allow_multiple BOOLEAN DEFAULT false
);

-- Relación items-modificadores
CREATE TABLE menu_item_modifiers (
  menu_item_id UUID REFERENCES menu_items(id),
  modifier_id UUID REFERENCES modifiers(id),
  PRIMARY KEY (menu_item_id, modifier_id)
);

-- Opciones de modificadores
CREATE TABLE modifier_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modifier_id UUID REFERENCES modifiers(id),
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0
);

-- Órdenes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('whatsapp', 'telefono', 'interno', 'web')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
  customer_name VARCHAR(200),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(100),
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('domicilio', 'recoger', 'mesa')),
  table_number VARCHAR(20),
  delivery_address TEXT,
  total DECIMAL(10,2) NOT NULL,
  estimated_time INTEGER, -- minutos
  notes TEXT,
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items de las órdenes
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  name VARCHAR(200) NOT NULL, -- Snapshot del nombre en el momento de la orden
  price DECIMAL(10,2) NOT NULL, -- Snapshot del precio
  quantity INTEGER NOT NULL DEFAULT 1,
  comments TEXT
);

-- Modificadores aplicados a items de orden
CREATE TABLE order_item_modifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  modifier_name VARCHAR(100) NOT NULL,
  modifier_type VARCHAR(20) NOT NULL,
  value INTEGER NOT NULL, -- -1 para quitar, 0 para normal, 1+ para extra
  options TEXT[], -- Array de opciones seleccionadas
  price_per_unit DECIMAL(10,2) DEFAULT 0,
  option_price DECIMAL(10,2) DEFAULT 0
);

-- Logs de auditoría
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(50),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Próximos Pasos Inmediatos

### 1. Configurar Base de Datos
```bash
# Instalar dependencias
npm install prisma @prisma/client
npm install -D prisma

# Inicializar Prisma
npx prisma init

# Configurar conexión a PostgreSQL
# Crear esquema de base de datos
# Generar cliente Prisma
```

### 2. Crear API Routes en Next.js
```typescript
// app/api/orders/route.ts
// app/api/menu/route.ts
// app/api/auth/route.ts
```

### 3. Migrar Hooks
```typescript
// hooks/useOrders.ts -> usar React Query + API calls
// hooks/useAuth.ts -> usar JWT + API calls
```

### 4. Crear Repositorio del ChatBot
```bash
mkdir nana-pancha-chatbot
cd nana-pancha-chatbot
npm init -y
npm install baileys twilio express
```

## Beneficios de esta Arquitectura

1. **Separación de responsabilidades**: Frontend, Backend y ChatBot independientes
2. **Escalabilidad**: Cada componente puede escalar independientemente
3. **Mantenibilidad**: Código más organizado y fácil de mantener
4. **Flexibilidad**: Fácil agregar nuevas integraciones (Telegram, etc.)
5. **Testing**: Cada componente se puede testear independientemente

## Consideraciones de Despliegue

- **Frontend**: Vercel (actual)
- **Backend API**: Vercel Functions o Railway/Render
- **Base de datos**: Supabase, Railway PostgreSQL, o Neon
- **ChatBot**: Railway, Render, o VPS
- **Webhooks**: ngrok para desarrollo local
