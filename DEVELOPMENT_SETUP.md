# Guía de Configuración para Desarrollo

## Configuración Inmediata (Base de Datos)

### 1. Instalar Dependencias de Base de Datos

```bash
# Instalar Prisma y dependencias
npm install prisma @prisma/client
npm install -D prisma

# Instalar React Query para manejo de estado del servidor
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools

# Instalar dependencias adicionales
npm install bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

### 2. Configurar Prisma

```bash
# Inicializar Prisma
npx prisma init

# Esto creará:
# - prisma/schema.prisma
# - .env (para variables de entorno)
```

### 3. Configurar Variables de Entorno

Crear/actualizar `.env`:
```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/nana_pancha?schema=public"

# JWT
JWT_SECRET="tu-secreto-super-seguro-aqui"
JWT_EXPIRES_IN="7d"

# Aplicación
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-nextauth"

# Para desarrollo local
NODE_ENV="development"
```

### 4. Configurar Base de Datos Local

#### Opción A: Docker (Recomendado)
```bash
# Crear docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: nana-pancha-db
    environment:
      POSTGRES_DB: nana_pancha
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Ejecutar base de datos
docker-compose up -d
```

#### Opción B: Supabase (Cloud)
1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar la URL de conexión a `.env`

### 5. Crear Esquema de Base de Datos

Actualizar `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  passwordHash  String    @map("password_hash")
  role          Role      @default(MESERO)
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  lastLoginAt   DateTime? @map("last_login_at")
  lastLoginIp   String?   @map("last_login_ip")
  
  // Relaciones
  assignedOrders Order[] @relation("AssignedOrders")
  auditLogs      AuditLog[]
  
  @@map("users")
}

model MenuCategory {
  id           String     @id @default(cuid())
  name         String
  icon         String?
  displayOrder Int        @default(0) @map("display_order")
  isActive     Boolean    @default(true) @map("is_active")
  
  // Relaciones
  items MenuItem[]
  
  @@map("menu_categories")
}

model MenuItem {
  id           String        @id @default(cuid())
  categoryId   String        @map("category_id")
  name         String
  description  String?
  price        Decimal       @db.Decimal(10, 2)
  isAvailable  Boolean       @default(true) @map("is_available")
  displayOrder Int           @default(0) @map("display_order")
  
  // Relaciones
  category   MenuCategory      @relation(fields: [categoryId], references: [id])
  modifiers  MenuItemModifier[]
  orderItems OrderItem[]
  
  @@map("menu_items")
}

model Modifier {
  id             String   @id @default(cuid())
  name           String
  type           ModifierType
  pricePerUnit   Decimal? @db.Decimal(10, 2) @map("price_per_unit")
  allowMultiple  Boolean  @default(false) @map("allow_multiple")
  
  // Relaciones
  menuItems MenuItemModifier[]
  options   ModifierOption[]
  
  @@map("modifiers")
}

model MenuItemModifier {
  menuItemId String @map("menu_item_id")
  modifierId String @map("modifier_id")
  
  // Relaciones
  menuItem MenuItem  @relation(fields: [menuItemId], references: [id])
  modifier Modifier  @relation(fields: [modifierId], references: [id])
  
  @@id([menuItemId, modifierId])
  @@map("menu_item_modifiers")
}

model ModifierOption {
  id         String  @id @default(cuid())
  modifierId String  @map("modifier_id")
  name       String
  price      Decimal @default(0) @db.Decimal(10, 2)
  
  // Relaciones
  modifier Modifier @relation(fields: [modifierId], references: [id])
  
  @@map("modifier_options")
}

model Order {
  id               String      @id @default(cuid())
  orderNumber      String      @unique @map("order_number")
  source           OrderSource
  status           OrderStatus @default(PENDIENTE)
  customerName     String?     @map("customer_name")
  customerPhone    String?     @map("customer_phone")
  customerEmail    String?     @map("customer_email")
  deliveryType     DeliveryType @map("delivery_type")
  tableNumber      String?     @map("table_number")
  deliveryAddress  String?     @map("delivery_address")
  total            Decimal     @db.Decimal(10, 2)
  estimatedTime    Int?        @map("estimated_time")
  notes            String?
  assignedTo       String?     @map("assigned_to")
  createdAt        DateTime    @default(now()) @map("created_at")
  updatedAt        DateTime    @updatedAt @map("updated_at")
  
  // Relaciones
  assignedUser User?        @relation("AssignedOrders", fields: [assignedTo], references: [id])
  items        OrderItem[]
  
  @@map("orders")
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String  @map("order_id")
  menuItemId String? @map("menu_item_id")
  name       String
  price      Decimal @db.Decimal(10, 2)
  quantity   Int     @default(1)
  comments   String?
  
  // Relaciones
  order      Order                @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItem   MenuItem?            @relation(fields: [menuItemId], references: [id])
  modifiers  OrderItemModifier[]
  
  @@map("order_items")
}

model OrderItemModifier {
  id            String  @id @default(cuid())
  orderItemId   String  @map("order_item_id")
  modifierName  String  @map("modifier_name")
  modifierType  String  @map("modifier_type")
  value         Int
  options       String[]
  pricePerUnit  Decimal @default(0) @db.Decimal(10, 2) @map("price_per_unit")
  optionPrice   Decimal @default(0) @db.Decimal(10, 2) @map("option_price")
  
  // Relaciones
  orderItem OrderItem @relation(fields: [orderItemId], references: [id], onDelete: Cascade)
  
  @@map("order_item_modifiers")
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?  @map("user_id")
  action     String
  tableName  String?  @map("table_name")
  recordId   String?  @map("record_id")
  oldValues  Json?    @map("old_values")
  newValues  Json?    @map("new_values")
  ipAddress  String?  @map("ip_address")
  userAgent  String?  @map("user_agent")
  createdAt  DateTime @default(now()) @map("created_at")
  
  // Relaciones
  user User? @relation(fields: [userId], references: [id])
  
  @@map("audit_logs")
}

// Enums
enum Role {
  ADMIN
  MESERO
  COCINERO
}

enum ModifierType {
  ADDITIVE
  SUBTRACTIVE
  OPTION
}

enum OrderSource {
  WHATSAPP
  TELEFONO
  INTERNO
  WEB
}

enum OrderStatus {
  PENDIENTE
  EN_PREPARACION
  LISTO
  ENTREGADO
  CANCELADO
}

enum DeliveryType {
  DOMICILIO
  RECOGER
  MESA
}
```

### 6. Ejecutar Migraciones

```bash
# Generar cliente Prisma
npx prisma generate

# Crear y aplicar migración
npx prisma migrate dev --name init

# (Opcional) Ver datos en Prisma Studio
npx prisma studio
```

### 7. Crear Datos de Prueba

Crear `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@nanapancha.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  // Crear categorías
  const pizzas = await prisma.menuCategory.upsert({
    where: { id: 'pizzas' },
    update: {},
    create: {
      id: 'pizzas',
      name: 'Pizzas',
      icon: '🍕',
      displayOrder: 1,
    },
  })

  // Crear items del menú
  const margherita = await prisma.menuItem.upsert({
    where: { id: 'pizza-margherita' },
    update: {},
    create: {
      id: 'pizza-margherita',
      categoryId: pizzas.id,
      name: 'Pizza Margherita',
      price: 12.99,
      displayOrder: 1,
    },
  })

  console.log({ admin, pizzas, margherita })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

```bash
# Ejecutar seed
npx prisma db seed
```

## Configuración del Frontend

### 1. Configurar React Query

Crear `lib/query-client.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
})
```

### 2. Configurar Provider en Layout

Actualizar `app/layout.tsx`:
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query-client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

## Próximos Pasos

1. **Ejecutar la configuración de base de datos**
2. **Crear API routes en Next.js**
3. **Migrar hooks para usar API**
4. **Crear repositorio separado para ChatBot**
5. **Implementar WebSockets para tiempo real**

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Base de datos
npx prisma studio          # Ver datos
npx prisma migrate dev     # Nueva migración
npx prisma generate        # Regenerar cliente
npx prisma db seed         # Ejecutar seed

# Docker
docker-compose up -d       # Levantar DB
docker-compose down        # Bajar DB
docker-compose logs        # Ver logs
```
