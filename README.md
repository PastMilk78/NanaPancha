# 🍽️ Mesero Nana - Sistema de Pedidos

Una interfaz moderna y intuitiva para meseros desarrollada en Next.js, diseñada para gestionar pedidos de comidas con opciones extra personalizables.

## ✨ Características

- **Interfaz intuitiva**: Diseño limpio y fácil de usar para meseros
- **Categorías de comidas**: Pizzas, Bebidas, Ensaladas/Entradas
- **Opciones extra**: Cada plato puede tener modificaciones personalizables
- **Gestión de pedidos**: Agregar, remover y modificar cantidades
- **Cálculo automático**: Total del pedido calculado en tiempo real
- **Responsive**: Funciona perfectamente en tablets y dispositivos móviles
- **Extensible**: Fácil agregar nuevas categorías y platos

## 🚀 Tecnologías Utilizadas

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos y ligeros
- **React Hooks** - Estado y efectos del lado del cliente

## 📋 Requisitos Previos

- Node.js 18.0 o superior
- npm o yarn
- Git

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/mesero-nana.git
   cd mesero-nana
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Construcción para Producción

```bash
npm run build
# o
yarn build
```

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue Automático (Recomendado)

1. **Conectar repositorio de GitHub**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "New Project"
   - Selecciona tu repositorio `mesero-nana`
   - Vercel detectará automáticamente que es un proyecto Next.js

2. **Configuración automática**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Variables de entorno** (si las necesitas)
   - Agrega cualquier variable de entorno en la sección "Environment Variables"

4. **Desplegar**
   - Haz clic en "Deploy"
   - Cada push a la rama principal se desplegará automáticamente

### Opción 2: Despliegue Manual

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Desplegar**
   ```bash
   vercel
   ```

3. **Seguir las instrucciones en terminal**

## 📱 Uso de la Aplicación

### Para Meseros

1. **Ver el menú**: Las categorías están organizadas por tipo de comida
2. **Seleccionar platos**: Haz clic en el botón "+" para ver opciones extra
3. **Personalizar**: Marca las casillas de las opciones extra deseadas
4. **Agregar al pedido**: Haz clic en "Agregar al Pedido"
5. **Gestionar pedido**: Usa los controles de cantidad en el resumen
6. **Finalizar**: Revisa el total y haz clic en "Finalizar Pedido"

### Agregar Nuevas Entradas

1. Haz clic en "Agregar Nueva Entrada"
2. Completa el nombre y elige un icono
3. Haz clic en "Guardar"

## 🎨 Personalización

### Colores
Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#ed7516', // Color principal
    600: '#de5a0c', // Hover
  }
}
```

### Estilos
Los estilos personalizados están en `app/globals.css` con clases utilitarias como:
- `.btn-primary` - Botones principales
- `.btn-secondary` - Botones secundarios
- `.card` - Contenedores de tarjetas
- `.input-field` - Campos de entrada

## 📁 Estructura del Proyecto

```
mesero-nana/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/             # Componentes reutilizables
│   ├── MenuItem.tsx       # Componente de elemento del menú
│   └── OrderSummary.tsx   # Resumen del pedido
├── types/                  # Definiciones de TypeScript
│   └── index.ts           # Interfaces y tipos
├── package.json            # Dependencias y scripts
├── tailwind.config.js      # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Este archivo
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construcción para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificación de código

## 🌟 Próximas Funcionalidades

- [ ] Sistema de autenticación para meseros
- [ ] Historial de pedidos
- [ ] Integración con sistema de cocina
- [ ] Modo offline para tablets
- [ ] Notificaciones push
- [ ] Reportes y estadísticas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación de Next.js

---

**Desarrollado con ❤️ para hacer la vida de los meseros más fácil**
