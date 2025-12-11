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
NEXT_PUBLIC_SITE_URL="[your-site-url]"
```

### 2. Configuración en Supabase Dashboard

#### Autenticación (Google OAuth)

1.  Ve a **Authentication** > **Providers** > **Google**.
2.  Habilítalo e ingresa tus credenciales de Google Cloud Console.
3.  En **URL Configuration** (Authentication > URL Configuration):
    - **Site URL:** `http://localhost:3000`
    - **Redirect URLs:** Agrega `http://localhost:3000/auth/callback`

#### Configuración de Email

1.  Ve a **Authentication** > **Notifications** > **Email**.
2.  En la plantilla `Confirm sign up`, chambia el enlace por defecto por:
    ```
    {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
    ```

### Configuración de Trigger para sincronización de perfiles

1.  Ve a **Database** > **SQL Editor** en Supabase Dashboard.
2.  Ejecuta el siguiente script para crear un trigger que sincronice los perfiles de usuario:

```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public."Profile" (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create function public.handle_delete_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  delete from public."Profile" where id = old.id;
  return old;
end;
$$;

create or replace function public.handle_user_update()
returns trigger as $$
language plpgsql
security definer set search_path = ''
begin
  if new.email <> old.email then
    update public."Profile"
    set email = new.email
    where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_delete_user();

create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute procedure public.handle_user_update();
```
