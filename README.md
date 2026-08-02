🏪ECOMMER  TechStore Pro


La plataforma de comercio electrónico diseñada para los amantes de la tecnología y el alto rendimiento


______________________________________________________________________________________________________
CARACTERÍSTICAS PRINCIPALES

. Catálogo Dinámico: Navegación intuitiva por categorías como Laptops, Gadgets, Periféricos y Audio.

. Búsqueda y Filtros Avanzados: Encuentra componentes y equipos rápidamente filtrando por especificaciones técnicas.

. Pasarela de Pagos Integrada: Proceso de compra (Checkout) rápido, fluido y seguro.

. Gestión de Pedidos: Seguimiento en tiempo real del estado del envío y compras realizadas.

. Diseño Adaptable: Experiencia totalmente optimizada para dispositivos móviles, tablets y computadores de escritorio.

. Panel de Administración: Gestión de inventarios, usuarios y ventas en tiempo real.

_____________________________________________________________________________________________________

Para empezar

 💻  Prerrequisitos

 1.  Node.js (recomendado para asegurar y gestionar la versión de Node)
    node -v
    
 3. • NPM (gestor de paquetes por defecto, viene incluido con Node)

npm --version

________________________________________________________________________________________________________

⌘ Instalación

1.  Clonar el repositorio

 https://github.com/Jlombanar/TiendaVirtual.git

 2. Instala las dependencias
    npm install

3. Arranca el servidor de desarrollo en localhost:8081
 npm run dev
_______________________________________________________________________________________________________

Estructura del proyecto
```
techstore-pro/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de BD, variables globales
│   │   ├── controllers/     # Lógica de negocio de las rutas
│   │   ├── middlewares/     # Autenticación, validaciones, manejo de errores
│   │   ├── models/          # Modelos de datos (Schemas)
│   │   ├── routes/          # Definición de los endpoints de la API
│   │   └── app.js           # Configuración principal de Express
│   ├── .env.example         # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js            # Punto de entrada y arranque del servidor
│
├── frontend/
│   ├── public/              # Archivos estáticos e index.html
│   ├── src/
│   │   ├── assets/          # Imágenes, logos, estilos globales
│   │   ├── components/      # Componentes reutilizables (Botones, Navbar, Cards)
│   │   ├── context/         # Estado global (Autenticación, Carrito)
│   │   ├── hooks/           # Custom Hooks de React
│   │   ├── pages/           # Vistas / Páginas principales (Home, Cart, Login)
│   │   ├── services/        # Peticiones HTTP a la API del Backend (Axios/Fetch)
│   │   ├── App.jsx          # Componente raíz y rutas de React
│   │   └── main.jsx         # Punto de entrada de React
│   ├── .env.example
│   └── package.json
│
└── README.md
```


   
