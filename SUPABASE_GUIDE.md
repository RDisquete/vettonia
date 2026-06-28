# Guía para conectar Vettonia a Supabase

## Prerrequisitos

El paquete `@supabase/supabase-js` ya está instalado.

## Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto:
   - **Name**: `vettonia` (o el que quieras)
   - **Database password**: genera una segura y guárdala
   - **Region**: elige la más cercana (ej. Frankfurt)
3. Espera a que termine la creación (~2 min)

## Paso 2: Obtener credenciales

1. En tu proyecto, ve a **Settings → API**
2. Copia estos valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## Paso 3: Configurar `.env`

Edita `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 4: Crear tablas y RLS

Ve a **SQL Editor** en Supabase y ejecuta este script completo:

```sql
-- ============================================================
-- VETTONIA — Migración completa: tablas + RLS + políticas
-- ============================================================

-- 1. TABLAS
-- ----------------------------------------

create table if not exists photos (
  id text primary key,
  caption text not null default '',
  author text not null default '',
  created_at timestamptz not null default now(),
  storage_path text not null
);

create table if not exists messages (
  id text primary key,
  text text not null,
  author text not null default 'Alma de foso',
  created_at timestamptz not null default now(),
  pass_number text
);

create table if not exists passes (
  number text primary key,
  name text not null default '',
  created_at timestamptz not null default now(),
  photo_url text
);

create table if not exists likes (
  id text primary key,
  photo_id text not null references photos(id) on delete cascade,
  pass_number text not null,
  created_at timestamptz not null default now()
);

create table if not exists alerts (
  id text primary key,
  user_id text not null,
  type text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. ROW LEVEL SECURITY
-- ----------------------------------------

alter table photos enable row level security;
alter table messages enable row level security;
alter table passes enable row level security;
alter table likes enable row level security;
alter table alerts enable row level security;

-- 3. POLÍTICAS DE ACCESO
-- ----------------------------------------

-- Lectura pública (todo el mundo puede ver)
create policy "Public read" on photos for select using (true);
create policy "Public read" on messages for select using (true);
create policy "Public read" on passes for select using (true);
create policy "Public read" on likes for select using (true);
create policy "Public read" on alerts for select using (true);

-- Inserción anónima (cualquiera puede insertar)
create policy "Anonymous insert" on photos for insert with check (true);
create policy "Anonymous insert" on messages for insert with check (true);
create policy "Anonymous insert" on passes for insert with check (true);
create policy "Anonymous insert" on likes for insert with check (true);
create policy "Anonymous insert" on alerts for insert with check (true);

-- Borrado por id (quien conoce el id puede borrar)
create policy "Delete by id" on photos for delete using (true);
create policy "Delete by id" on messages for delete using (true);
create policy "Delete by id" on likes for delete using (true);
create policy "Delete by id" on alerts for delete using (true);

-- Actualización
create policy "Update by id" on passes for update using (true);
create policy "Update by id" on photos for update using (true);
```

## Paso 5: Crear bucket de Storage

1. Ve a **Storage** en Supabase
2. Crea un nuevo bucket:
   - **Name**: `photos`
   - **Public**: ✅ activado
3. En la pestaña **Policies**, añade:
   ```sql
   create policy "Public read" on storage.objects for select using (bucket_id = 'photos');
   create policy "Anyone can upload" on storage.objects for insert with check (bucket_id = 'photos');
   create policy "Anyone can delete" on storage.objects for delete using (bucket_id = 'photos');
   ```

## Verificar conexión

Reinicia el servidor de desarrollo y abre la app. Si las credenciales son correctas:

- Las fotos se subirán al bucket `photos` de Supabase
- Los mensajes del muro se guardarán en la tabla `messages`
- Los pases se almacenarán en la tabla `passes`
- Los likes se registrarán en la tabla `likes`
- Las alertas irán a la tabla `alerts`

Todo sigue funcionando aunque Supabase no esté configurado — los datos se guardan en localStorage como respaldo.

---

## Solución de problemas

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| Los datos se guardan en localStorage | Credenciales vacías o incorrectas | Revisa `.env` |
| Error 401 en consola | RLS bloqueando escritura | Ejecuta las políticas de inserción |
| Error 404 en Storage | Bucket no creado | Crea bucket `photos` público |
| CORS errors | URLs incorrectas | Usa la URL exacta de Settings → API |

## Paso 6: Autenticación real

### 6.1 Configurar Auth en Supabase

1. Ve a **Authentication → Settings** en Supabase
2. **Desactiva** la confirmación por email ("Confirm email" = OFF) para que los usuarios de pase puedan registrarse sin verificar email
3. En **Authentication → Providers**, asegúrate de que **Email** está activado

### 6.2 Crear usuario admin

1. Ve a **Authentication → Users**
2. Haz clic en **Invite user** o **Add user**
3. Crea un usuario con el email y contraseña que usarás para acceder al panel `/admin`
4. Este usuario se autentica vía `supabase.auth.signInWithPassword()` desde el login de admin

### 6.3 Añadir columna `pin` a la tabla `passes`

Ejecuta en el SQL Editor:

```sql
alter table passes add column if not exists pin text;
```

Esta columna almacena el PIN que los usuarios configuran para proteger su pase. La verificación se hace consultando `SELECT * FROM passes WHERE number = ? AND pin = ?`.

## Migration 4: Perfiles de usuario (registro con email)

Ejecuta en el SQL Editor:

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  pass_number text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
```

En **Authentication → Settings**, asegúrate de que **Confirm email** está OFF para que el registro sea instantáneo.

---

### 6.6 QR de pase — validación en puerta

El pase digital genera un QR (`qrcode.react`) que codifica `{"v":1,"n":"Nombre","p":"VET-000001"}`. Para validar en puerta:

1. Escanea el QR con cualquier lector
2. Llama a `validatePassQR(content)` desde `src/services/qr.ts`
3. El servicio busca el pase en Supabase (`passes` table por `number`) y verifica que el nombre coincida

El endpoint de validación se puede exponer como función serverless o como ruta protegida en la app.

---

## Migration 4: Tabla de favoritos (itinerario personal)

Ejecuta en el SQL Editor:

```sql
create table if not exists favorites (
  id text primary key,
  artist_slug text not null,
  pass_number text not null,
  created_at timestamptz not null default now()
);

alter table favorites enable row level security;

create policy "Public read" on favorites for select using (true);
create policy "Anonymous insert" on favorites for insert with check (true);
create policy "Delete by id" on favorites for delete using (true);
alter table favorites replica identity full;

create index if not exists idx_favorites_pass on favorites(pass_number);
create index if not exists idx_favorites_artist on favorites(artist_slug);
```

Este itinerario permite a los usuarios marcar artistas como favoritos (★) directamente desde el cartel o la lista de artistas. Los favoritos se muestran en una banda "Mi itinerario" en la página de lineup, con detección visual de solapamientos de horario entre distintos escenarios.

---

## Migration 5: Tabla de reacciones (❤️ 🔥 🎉) + Realtime

Ejecuta en el SQL Editor:

```sql
create table if not exists reactions (
  id text primary key,
  photo_id text not null references photos(id) on delete cascade,
  pass_number text not null,
  type text not null check (type in ('❤️', '🔥', '🎉')),
  created_at timestamptz not null default now()
);

alter table reactions enable row level security;

create policy "Public read" on reactions for select using (true);
create policy "Anonymous insert" on reactions for insert with check (true);
create policy "Delete by id" on reactions for delete using (true);

create index if not exists idx_reactions_photo on reactions(photo_id);
create index if not exists idx_reactions_pass on reactions(pass_number);

-- Realtime: necesario para que las fotos nuevas aparezcan en vivo
-- Ve a Database → Replication y asegúrate de que la tabla `photos`
-- tiene la replicación habilitada (INSERT).
-- Esto permite que el frontend se suscriba vía Supabase Realtime
-- y reciba las fotos nuevas al instante sin recargar.
```

Esta migración permite el álbum colaborativo en tiempo real: los usuarios ven las nuevas fotos aparecer con animación mientras navegan, sin necesidad de recargar la página. Cada foto se puede reaccionar con ❤️ 🔥 🎉 además del like existente.

---

## Migration 6: Encuestas y votaciones

Ejecuta en el SQL Editor:

```sql
create table if not exists poll_votes (
  id text primary key,
  poll_id text not null,
  option_id text not null,
  pass_number text not null,
  created_at timestamptz not null default now()
);

alter table poll_votes enable row level security;

create policy "Public read" on poll_votes for select using (true);
create policy "Anonymous insert" on poll_votes for insert with check (true);

create index if not exists idx_poll_votes_poll on poll_votes(poll_id);
create index if not exists idx_poll_votes_pass on poll_votes(pass_number);

-- Unique constraint: one vote per pass per poll
alter table poll_votes add constraint unique_vote_per_pass unique (poll_id, pass_number);

-- Realtime: necesario para que los resultados se actualicen en vivo
-- Ve a Database → Replication y activa la replicación de la tabla `poll_votes`

-- Función auxiliar para obtener resultados agregados
create or replace function get_poll_results(p_poll_id text)
returns table (option_id text, vote_count bigint) as $$
  select option_id, count(*)::bigint as vote_count
  from poll_votes
  where poll_id = p_poll_id
  group by option_id
  order by vote_count desc;
$$ language sql stable;
```

Esta migración permite la encuesta "Mejor actuación de Vettonia 2026" con una votación por pase, ranking en tiempo real con barras de progreso animadas.

---

## Migration 3: Añadir status a photos + tabla lineup_artists

Ejecuta en el SQL Editor después de las migraciones anteriores:

```sql
-- Añadir status a photos (pending / approved / rejected)
alter table photos add column if not exists status text not null default 'pending';
alter table photos add column if not exists rejection_reason text;

-- Las fotos existentes se marcan como approved
update photos set status = 'approved' where status is null or status = 'pending';

-- Tabla para el lineup CRUD desde el admin
create table if not exists lineup_artists (
  slug text primary key,
  name text not null,
  bio text not null default '',
  stage text not null,
  time text not null default '',
  image text not null default '',
  genre text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table lineup_artists enable row level security;

create policy "Allow anonymous read on lineup_artists"
  on lineup_artists for select using (true);
create policy "Allow anonymous insert on lineup_artists"
  on lineup_artists for insert with check (true);
create policy "Allow anonymous update on lineup_artists"
  on lineup_artists for update using (true) with check (true);
create policy "Allow anonymous delete on lineup_artists"
  on lineup_artists for delete using (true);
```

Para sembrar los datos estáticos en Supabase, usa el botón "Sincronizar" en el panel de admin → Cartel. Alternativamente, ejecuta el seed manual desde la app tras iniciar sesión como admin.

### 6.4 Cómo funciona la autenticación de pases

Cuando un usuario configura un PIN en su pase:

1. El PIN se guarda en la columna `pin` de la tabla `passes`
2. Se crea un usuario en Supabase Auth con:
   - Email sintético: `pass-{numero}@vettonia.app` (ej. `pass-vet000001@vettonia.app`)
   - Contraseña: el PIN elegido
3. En sucesivos accesos, el usuario introduce su número de pase + PIN
4. La app verifica el PIN contra la tabla `passes` y luego inicia sesión en Supabase Auth
5. Supabase gestiona automáticamente el refresh token y la sesión persistente

### 6.5 Flujo de sesiones persistentes

- El cliente Supabase se crea con `autoRefreshToken: true` y `persistSession: true` (valores por defecto)
- El token de sesión se guarda en `localStorage` bajo la clave `sb-{project-ref}-auth-token`
- Si el token expira, Supabase lo refresca automáticamente usando el refresh token
- El admin usa el mismo mecanismo: al iniciar sesión en `/admin`, la sesión persiste aunque se cierre el navegador

## Migración de datos existentes

Si ya tienes datos en localStorage y quieres migrarlos a Supabase:

```sql
-- Script de migración (ejecutar cuando haya datos en localStorage)
-- Ayúdame a generarlo cuando tengas las credenciales puestas.
```
