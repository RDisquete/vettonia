# Plan: Admin login + galería de admin funcional

## 1. `AdminLayout.tsx` — Añadir login

- Añadir estado `authed` (inicializado desde `localStorage`)
- Si no autenticado → mostrar `<Login>` component en lugar de `<Outlet />`
- Login: input de contraseña, valida contra `RDISQUETE`, guarda flag en localStorage
- Botón "Cerrar sesión" en el header

**Ficheros a modificar:**
- `src/pages/admin/AdminLayout.tsx`

## 2. `GalleryManage.tsx` — Mostrar fotos reales + borrar

- Importar `getPhotos` y `deletePhoto` de `src/lib/storage.ts`
- Mostrar grid de fotos con: thumbnail, autor, caption, fecha
- Botón "Quitar" con confirmación
- Stats: total fotos, autores únicos, última subida

**Ficheros a modificar:**
- `src/pages/admin/GalleryManage.tsx`

## 3. `storage.ts` — Sin cambios necesarios

Las funciones `getPhotos()` y `deletePhoto(id)` ya existen y funcionan con localStorage (y con Supabase cuando esté configurado).

## Archivos involucrados
- `src/pages/admin/AdminLayout.tsx` — modificar
- `src/pages/admin/GalleryManage.tsx` — modificar
