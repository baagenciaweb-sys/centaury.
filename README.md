# Tienda Online - Aplicación de Retail

Una aplicación web completa para una tienda minorista con catálogo de productos, carrito de compras y panel de administración.

## Características

### Vista Pública (Clientes)
- Página de inicio con banner, categorías y productos destacados
- Catálogo de productos con filtros por categoría y búsqueda
- Carrito de compras persistente
- Página de contacto con WhatsApp

### Panel de Administración
- Login con email y contraseña (Firebase Authentication)
- Gestión de productos (agregar, editar, eliminar)
- Gestión de categorías
- Subida de imágenes para productos

## Tecnologías
- React + TypeScript
- Vite
- Tailwind CSS
- Firebase (Firestore, Auth, Storage)
- React Router DOM

## Configuración de Firebase

### 1. Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Habilita Authentication con Email/Password
5. Habilita Storage para las imágenes

### 2. Obtener credenciales
1. En Firebase Console, ve a Project Settings
2. Copia la configuración de tu app web

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id

# Configuración de la tienda
VITE_STORE_NAME=Mi Tienda
VITE_STORE_ADDRESS=Dirección de la Tienda
VITE_WHATSAPP_NUMBER=1234567890
```

### 4. Configurar reglas de seguridad en Firebase

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Crear usuario administrador
1. En Firebase Console, ve a Authentication
2. Agrega un usuario con email y contraseña
3. Usa estas credenciales para acceder al panel de admin

## Instalación

```bash
npm install
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/         # Contextos de React
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── hooks/            # Custom hooks
│   ├── useFirestore.ts
│   └── useStorage.ts
├── pages/            # Páginas
│   ├── Home.tsx
│   ├── Catalog.tsx
│   ├── Cart.tsx
│   ├── Contact.tsx
│   └── admin/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Products.tsx
│       └── Categories.tsx
├── types/            # Definiciones de TypeScript
├── config/           # Configuración de Firebase
└── App.tsx          # Componente principal con routing
```

## Uso

### Vista Pública
- Navega el catálogo y filtra por categorías
- Agrega productos al carrito
- Consulta el carrito y envía pedidos por WhatsApp
- Contacta a la tienda por WhatsApp

### Panel de Administración
1. Accede a `/admin/login`
2. Inicia sesión con las credenciales de Firebase
3. Gestiona categorías desde el dashboard
4. Agrega productos con imagen, nombre, descripción, precio y categoría
5. Edita o elimina productos existentes

## Build

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.
