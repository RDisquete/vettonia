# 🏕️ Vettonia 2026 — Festival PWA

[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Tests-247_passing-4ade80)](https://vitest.dev/)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8)](https://vite-pwa-org.netlify.app/)

**Vettonia** es una web progresiva (PWA) para un festival de música real en la sierra de Madrid — 48 artistas, 3 escenarios, una experiencia digital completa. Construida desde cero como proyecto personal para demostrar dominio del stack moderno de frontend, arquitectura limpia y visión de producto.

> 🎯 Este README es mi carta de presentación como desarrollador. No es un manual de instalación: es una muestra de cómo pienso, arquitecto y ejecuto.

---

## 📦 Lo que encontrarás aquí

| Dimensión | Lo que demuestra |
|-----------|------------------|
| **Arquitectura** | Separación clara en capas (pages / services / components), single-responsibility, barrel exports, lazy loading |
| **Datos** | Patrón **Supabase first, localStorage fallback** — 100% funcional offline. Cada servicio es async, tipado y testeado |
| **Estado global cero** | Sin Redux, sin Zustand, sin contextos hinchados. Datos locales al componente con useState + useEffect, datos compartidos vía servicios |
| **Testing real** | **247 tests, 67 archivos, 0 dependencias de mocking automágico.** Vitest + Testing Library con mocks explícitos. Cada componente y servicio tiene su test |
| **UX** | Framer Motion para transiciones de página, skeleton loaders, skip-to-content, SEO por ruta con JSON-LD, lazy loading de imágenes |
| **PWA real** | Service worker con Workbox, manifest, precaching de assets, runtime caching de fuentes y APIs, navegación offline |
| **Admin funcional** | CRUD de artistas, aprobación de fotos, dashboard con métricas en vivo, bulk publish — todo sin framework de backend |

---

## 🧠 Decisiones técnicas clave

### ❌ No usar Redux / Zustand
El estado de esta app es 90% URL-driven (react-router) y 10% local a componentes. Añadir un state manager global habría sido sobredimensionar. Los datos compartidos (usuario, pase, álbum) viven en localStorage y se accede a ellos mediante servicios, no contexto.

### ❌ No usar React Query / SWR
Cada página se monta, llama a un servicio async y renderiza. Con un festival no hay datos que invalidar en tiempo real (salvo el muro de mensajes, que usa refetch manual). Añadir una capa de caching habría sido abstracción innecesaria.

### ✅ Supabase sin Auth helpers
La autenticación es ligera: código de álbum en sessionStorage, pase en localStorage, y Supabase Auth directo para admin. Sin abstracciones — `supabase.auth.signInWithPassword()` y listo.

### ✅ Servicios que son solo funciones
No hay clases, no hay instancias, no hay DI. Cada servicio es un archivo con funciones async exportadas. Predecible, testeable, sin magia.

```ts
// Patrón que se repite en cada servicio:
export async function getPhotos(status?: PhotoStatus): Promise<UploadedPhoto[]> {
  try {
    const { data } = await supabase.from('photos').select('*').eq('status', status ?? 'approved')
    return data ?? []
  } catch {
    return JSON.parse(localStorage.getItem('vettonia_photos') ?? '[]')
  }
}
```

---

## 🏗️ Arquitectura en una diapositiva

```
src/
├── pages/          # 1 archivo = 1 ruta. Sin lógica de negocio.
│   ├── Access/     # Split real: index.tsx + hooks.ts + components/
│   └── admin/      # Dashboard, LineupManage, GalleryManage, Alerts
├── services/       # Capa de datos async. Supabase → localStorage.
│   ├── album.ts    # Fotos, likes, auth de álbum, estados (pending/approved)
│   ├── lineup.ts   # CRUD de artistas, publish/draft, seed desde data/
│   ├── pass.ts     # Pases, PIN, foto de perfil, tema visual
│   ├── messages.ts # Muro de mensajes
│   ├── stats.ts    # Métricas agregadas
│   ├── alerts.ts   # Notificaciones push-like
│   └── auth.ts     # Supabase Auth (admin + pases)
├── components/     # 15 componentes UI puros. Sin efectos, sin servicios.
├── sections/       # Secciones de landing (Hero, Footer, LineupPreview...)
├── constants/      # Colores por género, colores por escenario, arrays visuales
├── data/           # Datos estáticos del lineup (seed para Supabase)
├── lib/            # Supabase client, compressImage, localStorage wrapper
├── types/          # Artist, UploadedPhoto, WallMessage, PassInfo, Alert...
└── hooks/          # useInView (interseccion observer)
```

### Routing

16 rutas, todas con `lazy()` + `<Suspense>` + `PageTransition` (framer-motion). Sin carga inicial masiva — cada página pesa ~2-5 KB gzipped.

---

## 🔐 Tres sistemas de autenticación distintos

| Sistema | Mecanismo | Persistencia |
|---------|-----------|-------------|
| **Álbum de fotos** | Código compartido (`VITE_ALBUM_CODE`) | sessionStorage |
| **Pase personal** | Número `VET-XXXXXX` + PIN opcional (Supabase Auth) | localStorage + refresh token |
| **Admin** | Email + contraseña (Supabase Auth) | Sesión persistente con auto-refresh |

Cada uno está aislado y resuelve un problema diferente sin compartir infraestructura de auth.

---

## 🧪 Testing real, no decorativo

```
npm run test      # 247 tests · 67 files · 0 flakes
npx tsc --noEmit  # Strict mode · 0 errors
npm run lint      # Flat config · 0 warnings
npm run build     # ~30 segundos · PWA + imágenes optimizadas
```

**Lo que testeo:**
- Cada componente renderiza correctamente (estado vacío, carga, error, éxito)
- Cada servicio funciona con Supabase y con localStorage (fallback cubierto)
- Cada ruta navega correctamente (MemoryRouter + Routes)
- Los hooks se comportan en montaje/desmontaje
- El flujo completo de autenticación (pase, álbum, admin)

**Lo que no testeo:**
- Estilos visuales (css: false en vitest)
- Integración real con Supabase (mocks en servicios)

Cada test es explícito — sin `vi.mock(..., {async factory})`, sin magia de hoisting, sin falsos positivos.

---

## 📱 PWA real

- **Service worker** generado con Workbox `generateSW`
- **Precaching** de JS, CSS, HTML, imágenes estáticas
- **Runtime caching** de Google Fonts (CacheFirst, 1 año) y Unsplash (CacheFirst, 1 semana)
- **Manifest** con icons 192+512, standalone, portrait
- **Offline fallback** — navigateFallback a index.html
- **Post-build** — renombra `.webmanifest` → `.json` para compatibilidad iOS

---

## ⚡ Rendimiento

| Métrica | Resultado |
|---------|-----------|
| Lighthouse Performance | ~95+ |
| First Contentful Paint | < 1.5s |
| Total JS (gzipped) | ~40 KB |
| Imágenes | Compresión automática con imagemin (mozjpeg q70, optipng l5) |
| Code splitting | Por ruta (lazy + Suspense) |
| Animaciones | GPU-accelerated (framer-motion, CSS transforms) |

---

## 🛠️ El stack en detalle

| Categoría | Tecnología | Por qué |
|-----------|-----------|---------|
| Framework | **React 19** | Estable, ecosistema maduro, mercado laboral |
| Build | **Vite 8** | Instantáneo en dev, tree-shaking nativo |
| Lenguaje | **TypeScript 6 strict** | `noUnusedLocals`, `noUnusedParameters`, `strict: true` |
| Estilos | **Tailwind 4** | `@import "tailwindcss"`, `@theme`, sin config |
| Backend | **Supabase** | Postgres + Storage + Auth, todo en uno, plan gratis generoso |
| Testing | **Vitest 4 + Testing Library** | Rápido, nativo de Vite, sin Jest config |
| PWA | **vite-plugin-pwa** | Workbox integration, zero config |
| Mapas | **Leaflet + react-leaflet** | OpenStreetMap, sin API key, sin coste |
| SEO | **react-helmet-async + JSON-LD** | Meta tags por ruta, schema.org para artistas |

---

## 📸 Demo visual

| | |
|---|---|
| **Landing** con Hero, countdown dinámico, marquee de artistas | **Cartel** con 3 escenarios, filtro por género |
| **Artista individual** con foto, bio, horario, JSON-LD | **Mapa** interactivo del recinto con Leaflet |
| **Área de pase** con álbum privado, muro de mensajes, perfil | **Admin** con dashboard, CRUD de lineup, moderación de fotos |
| **Galería** pública con fotos aprobadas, modal lightbox | **Subida** de fotos con compresión canvas previa |
| **PWA** instalable, offline, service worker | **SEO** etiquetas OG, Twitter Cards, JSON-LD por página |

---

## 📬 Contacto

Este proyecto es mi portfolio. Si buscas un desarrollador que:

- Escribe código pensando en el que viene detrás
- No añade librerías por moda
- Testea lo que importa
- Respeta el principio de mínimo poder
- Sabe cuándo NO usar una abstracción

[Hablemos.](mailto:tu-email@ejemplo.com)

---

*Vettonia 2026 — 48 artistas, 3 escenarios, 0 frameworks innecesarios.*
