# MoTracks

MoTracks es una plataforma web desarrollada para apoyar la administración de un taller mecánico de motocicletas. El sistema permite gestionar usuarios, motocicletas, citas, servicios, catálogos y seguimiento técnico.

## Acceso al sistema

La aplicación se encuentra desplegada mediante Cloudflare y puede accederse desde la siguiente URL:

https://bitter-union-6cfd.vrafaelb1500.workers.dev/

## Tecnologías utilizadas

- HTML
- JavaScript
- TailwindCSS
- Supabase
- Supabase Auth
- PostgreSQL
- Visual Studio Code
- Live Server
- Cloudflare

## Roles del sistema

El sistema maneja tres tipos de usuarios:

### Cliente
- Crea una cuenta.
- Inicia sesión.
- Registra motocicletas.
- Agenda citas.
- Consulta el estado de sus citas.

### Administrador
- Gestiona usuarios.
- Administra servicios.
- Administra catálogos.
- Consulta citas.
- Asigna mecánicos.

### Mecánico
- Consulta citas asignadas.
- Actualiza estatus de citas.
- Registra diagnóstico.
- Registra kilometraje.
- Actualiza total estimado.
- Agrega notas de seguimiento.

## Estructura del proyecto

MOTRACKS/
├── index.html
├── config/
│   └── supabase.js
├── interfaces/
│   ├── admin.html
│   ├── cliente.html
│   ├── index.html
│   ├── mecanico.html
│   └── registro.html
├── js/
│   ├── admin-appointments.js
│   ├── admin-catalogs.js
│   ├── admin-services.js
│   ├── auth.js
│   ├── client-data.js
│   └── mechanic-data.js
└── README.md

## Descripción de carpetas

- `interfaces`: contiene las páginas HTML del sistema.
- `js`: contiene la lógica de programación del sistema.
- `config`: contiene la configuración de conexión con Supabase.
- `index.html`: redirige a la pantalla principal de la aplicación.

## Ejecución local

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Verificar que el archivo `config/supabase.js` tenga configurada la conexión con Supabase.
3. Abrir el archivo `index.html`.
4. Ejecutar con Live Server.
5. El navegador redirige a la pantalla principal de MoTracks.

## Base de datos

La base de datos se administra en Supabase mediante PostgreSQL. El sistema utiliza tablas para perfiles, motocicletas, marcas, modelos, versiones, colores, servicios, citas, servicios por cita y bitácoras de seguimiento.

## Despliegue

El sistema se despliega en Cloudflare como aplicación web. Al estar publicado en la nube, los usuarios acceden desde un navegador sin instalar software adicional.

## Autor

Rafael Bello Víctor Miguel  
Proyecto: MoTracks  
Materia: Ingeniería de Software