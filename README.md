# NegocioSpot

NegocioSpot is a web platform that allows users to discover and connect with local businesses easily and efficiently. Built with Next.js, Supabase, and Prisma, it offers a fast and secure experience for both users and business administrators.

## 🚀 Technologies Used

- **Next.js**: React framework for fast and optimized web applications.
- **Supabase**: Backend as a service providing authentication, database, and storage.
- **Prisma**: ORM for efficient and secure database management.
- **Mantine**: UI component library for React.
- **TypeScript**: Superset of JavaScript that adds static typing.

## Main Features

- User registration and login via Google OAuth.
- User and business profile management.
- Search and filter local businesses.
- Custom subdomains for each business.
- Admin panel for business owners.
- Modern and responsive user interface.

## 🛠 Setup and Environment Variables

### 1. Environment Variables (`.env`)

Rename `.env.example` to `.env` and fill in the values according to your Supabase setup:

```bash
DATABASE_URL="postgres://postgres.[ref]:[password]@[host]:5432/postgres?pgbouncer=true"
NEXT_PUBLIC_SUPABASE_URL="[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="[your-supabase-publishable-key]"
NEXT_PUBLIC_SITE_URL="[your-site-url]"
```

### 2. Supabase Dashboard Configuration

#### Authentication (Google OAuth)

1.  Go to **Authentication** > **Providers** > **Google**.
2.  Enable it and enter your Google Cloud Console credentials.
3.  In **URL Configuration** (Authentication > URL Configuration):
    - **Site URL:** `http://localhost:3000`
    - **Redirect URLs:** Add `http://localhost:3000/auth/callback`

#### Email Configuration

1.  Go to **Authentication** > **Notifications** > **Email**.
2.  In the `Confirm sign up` template, change the default link to:
    ```
    {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
    ```

#### Profile Synchronization Trigger Setup

1.  Go to **Database** > **SQL Editor** in the Supabase Dashboard.
2.  Run the following script to create a trigger that synchronizes user profiles:

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
