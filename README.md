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
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="[your-google-maps-api-key]"
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID="[your-google-maps-map-id]"
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

### 3. Configure Supabase Storage

1. Go to **Storage** > **Buckets** in the Supabase Dashboard.
2. Create a new bucket named `profile-images`.
3. Set the bucket to be public for easier access to profile images.
4. Restrict the file size and mime types as needed (e.g., max size 600KB, allowed types: `image/webp`. This app stores webp images only).
5. Add a new policy to allow authenticated users to upload and manage their profile images:

```sql
create policy "Allow authenticated users to insert into profile-images bucket"
    on storage.objects
    for insert
    to authenticated
    with check (bucket_id = 'profile-images');
```

### 4. Configure Business Available Tags

1. Run the following SQL script in the Supabase SQL Editor to populate the `Tag` table with initial tags, for example:

```sql
-- Clean table if needed
-- TRUNCATE TABLE "Tag" RESTART IDENTITY CASCADE;

INSERT INTO "Tag" ("name") VALUES
('Italiana'), ('Mexicana'), ('Salvadoreña'), ('China'), ('Japonesa'),
('Americana'), ('Francesa'), ('Española'), ('India'), ('Tailandesa'),
('Peruana'), ('Argentina'), ('Coreana'), ('Vietnamita'), ('Libanesa'),
('Mediterránea'), ('Caribeña'), ('Brasileña'), ('Turca'), ('Griega'),
('Alemana'), ('Fusión'), ('Internacional'), ('Asiática'), ('Latina'),
('Hamburguesas'), ('Pizza'), ('Tacos'), ('Sushi'), ('Mariscos'),
('Carnes'), ('Asados'), ('Pollo'), ('Alitas'), ('Pupusas'),
('Postres'), ('Café'), ('Panadería'), ('Pastelería'), ('Heladería'),
('Donas'), ('Crepas'), ('Waffles'), ('Sandwiches'), ('Ensaladas'),
('Sopas'), ('Ramen'), ('Poke'), ('Tapas'), ('Ceviche'),
('Pasta'), ('Burritos'), ('Chocolatería'), ('Smoothies'), ('Bubble Tea'),
('Desayunos'), ('Almuerzos'), ('Cenas'), ('Brunch'), ('Buffet'),
('Fast Food'), ('Gourmet'), ('Comida Callejera'), ('Food Court'), ('Fine Dining'),
('Cafetería'), ('Bar'), ('Pub'), ('Gastrobar'), ('Sports Bar'),
('Food Truck'), ('Restaurante de Hotel'), ('Bistro'), ('Steakhouse'),
('Vegano'), ('Vegetariano'), ('Sin Gluten'), ('Keto'), ('Saludable'),
('Orgánico'), ('Pescatariano'), ('Bajo en Calorías'),
('Familiar'), ('Romántico'), ('Negocios'), ('Amigos'), ('Pareja'),
('Ideal para Niños'), ('Grupos Grandes'), ('Solo'), ('Elegante'), ('Casual'),
('Instagrameable'), ('Tradicional'), ('Moderno'), ('Rústico'),
('Terraza'), ('Aire Libre'), ('Rooftop'), ('Vista Panorámica'), ('Jardín'),
('Pet Friendly'), ('WiFi Gratis'), ('Estacionamiento'), ('Drive-thru'), ('Delivery'),
('Para Llevar'), ('Reservas'), ('24 Horas'), ('Abierto Tarde'), ('Música en Vivo'),
('Pantallas / Deportes'), ('Accesibilidad Silla de Ruedas'), ('Aire Acondicionado'), ('Zona de Juegos'), ('Eventos Privados'),
('Coctelería de Autor'), ('Carta de Vinos'), ('Cerveza Artesanal');
```

### 5. Configure Google Maps API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Maps JavaScript API** and **Maps Embed API** for your project.
4. Create API credentials and restrict them to your domain or localhost for development.
5. Copy the API key and paste it into the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable in your `.env` file.
6. Set up a custom map in the Google Cloud Console and copy the Map ID to the `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` environment variable.
