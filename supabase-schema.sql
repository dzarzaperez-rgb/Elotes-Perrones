-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase

create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  price numeric not null,
  "imageUrl" text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security) para proteger los datos
alter table public.products enable row level security;

-- Políticas de seguridad (RLS)

-- 1. Cualquier persona (público) puede VER los productos
create policy "Los productos son públicos para leer"
  on public.products for select
  using ( true );

-- 2. Solo los usuarios AUTENTICADOS (el admin) pueden INSERTAR, ACTUALIZAR o ELIMINAR
create policy "Solo admin puede insertar"
  on public.products for insert
  with check ( auth.role() = 'authenticated' );

create policy "Solo admin puede actualizar"
  on public.products for update
  using ( auth.role() = 'authenticated' );

create policy "Solo admin puede eliminar"
  on public.products for delete
  using ( auth.role() = 'authenticated' );
