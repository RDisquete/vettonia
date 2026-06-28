🏕️ Vettonia 2026

Vettonia 2026 es una Progressive Web App desarrollada para un festival de música celebrado en Extremadura.

El objetivo del proyecto era crear una experiencia digital completa para asistentes y organización: consultar el cartel, descubrir artistas, acceder a información del recinto, gestionar pases, compartir fotografías y mantener una comunicación directa durante el evento.

Más allá de la funcionalidad, este proyecto ha sido una oportunidad para trabajar aspectos que considero fundamentales en cualquier aplicación moderna: arquitectura, rendimiento, accesibilidad, testing y experiencia de usuario.

⸻

¿Qué incluye?

* Cartel completo con artistas y escenarios
* Fichas individuales de artistas
* Mapa interactivo del recinto
* Sistema de pases digitales
* Galería colaborativa de fotografías
* Muro de mensajes para asistentes
* Panel de administración
* Optimización SEO
* Funcionalidad offline mediante PWA

⸻

Enfoque técnico

He intentado mantener la aplicación lo más simple posible sin renunciar a una estructura sólida.
La lógica de negocio está separada de la interfaz mediante una capa de servicios, los componentes se mantienen reutilizables y las rutas se cargan de forma diferida para mejorar el rendimiento inicial.
La aplicación utiliza Supabase como backend principal para autenticación, almacenamiento y base de datos, pero también incorpora mecanismos de persistencia local para determinados escenarios donde la conectividad puede ser limitada.
Mi objetivo no era utilizar muchas herramientas, sino elegir las necesarias y sacarles el máximo partido.

⸻

src/
├── pages/
├── services/
├── components/
├── sections/
├── hooks/
├── lib/
├── types/
└── data/


Cada carpeta tiene una responsabilidad clara:

* pages contiene las rutas de la aplicación.
* services centraliza el acceso a datos.
* components agrupa elementos reutilizables de interfaz.
* hooks encapsula lógica compartida.
* types mantiene el tipado de dominio.
* lib contiene utilidades y configuraciones comunes.

Esta organización me permite escalar funcionalidades sin que el proyecto se vuelva difícil de mantener

⸻

Testing

La aplicación cuenta con una batería completa de pruebas automatizadas utilizando Vitest y Testing Library.

Los tests cubren:

* Componentes
* Servicios
* Navegación
* Flujos de autenticación
* Casos de error y estados de carga

Más que perseguir una cifra de cobertura, el objetivo es garantizar que las funcionalidades críticas sigan funcionando cuando el proyecto evolucione.

⸻

Rendimiento

Se han aplicado distintas optimizaciones para mantener tiempos de carga reducidos:

* Lazy loading por rutas
* División automática de código
* Optimización de imágenes
* Precarga de recursos críticos
* Estrategias de caché mediante Service Worker
* Puntuaciones Lighthouse superiores a 95

⸻

Stack tecnológico

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Supabase
* Vitest
* Testing Library
* Framer Motion
* Leaflet
* Workbox

⸻

Lo que representa este proyecto

Vettonia no es un ejercicio ni una aplicación creada para seguir un tutorial.
Es un proyecto construido alrededor de un caso de uso real donde he podido aplicar conocimientos de desarrollo frontend, arquitectura, testing, accesibilidad y experiencia de usuario en un único producto.
Es, sobre todo, una muestra de cómo me gusta trabajar: priorizando la claridad, el mantenimiento a largo plazo y la calidad del producto final.