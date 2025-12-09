# NegocioSpot

NegocioSpot es una plataforma web que permite a los usuarios descubrir y conectar con negocios
locales de manera fácil y eficiente. Construida con Next.js, Supabase y Prisma, ofrece una
experiencia rápida y segura tanto para usuarios como para administradores de negocios.

## 🚀 Tecnologías Utilizadas

- **Next.js**: Framework de React para aplicaciones web rápidas y optimizadas.
- **Supabase**: Backend como servicio que proporciona autenticación, base de datos y almacenamiento.
- **Prisma**: ORM para gestionar la base de datos de manera eficiente y segura.
- **Mantine**: Biblioteca de componentes UI para React.
- **TypeScript**: Superset de JavaScript que añade tipado estático.

## Capacidades Principales

- Registro e inicio de sesión de usuarios mediante Google OAuth.
- Gestión de perfiles de usuario y negocios.
- Búsqueda y filtrado de negocios locales.
- Subdominios personalizados para cada negocio.
- Panel de administración para dueños de negocios.
- Interfaz de usuario moderna y responsiva.

## 🛠 Configuración y Variables de Entorno

### 1. Variables de Entorno (`.env`)

Renombra `.env.example` a `.env` y completa los valores según tu configuración de Supabase:

```bash
DATABASE_URL="postgres://postgres.[ref]:[password]@[host]:5432/postgres?pgbouncer=true"
NEXT_PUBLIC_SUPABASE_URL="[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="[your-supabase-publishable-key]"
```

### 2. Configuración en Supabase Dashboard

#### Autenticación (Google OAuth)

1.  Ve a **Authentication** > **Providers** > **Google**.
2.  Habilítalo e ingresa tus credenciales de Google Cloud Console.
3.  En **URL Configuration** (Authentication > URL Configuration):
    - **Site URL:** `http://localhost:3000`
    - **Redirect URLs:** Agrega `http://localhost:3000/auth/callback`
