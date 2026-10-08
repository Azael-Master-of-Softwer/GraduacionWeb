# GraduacionWeb

Sistema web para la administración y seguimiento de una graduación.

## Objetivo

El proyecto busca facilitar la administración de una graduación mediante una plataforma web donde los graduados puedan consultar su información, pagos, fechas importantes y avisos.

Los administradores podrán gestionar graduados, pagos, fechas y otra información relacionada con la organización de la graduación.

## Tecnologías

### Backend
- C#
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- ASP.NET Core Identity
- JWT

### Frontend
- React
- TypeScript
- Vite
- CSS

### Herramientas
- Visual Studio
- Visual Studio Code
- Git
- GitHub
- pgAdmin

## Estructura

```text
GraduacionWeb/
├── backend/
├── frontend/
├── docs/
├── .gitignore
└── README.md
```

## Funcionalidades

### Graduados
- Registro mediante código
- Inicio de sesión
- Consulta de información personal
- Consulta de pagos
- Consulta de fechas importantes

### Administradores
- Gestión de graduados
- Gestión de pagos
- Gestión de fechas
- Gestión de información del sistema

## Estado del proyecto

Actualmente se encuentra en desarrollo.

El backend cuenta con autenticación, roles de administrador y graduado, registro mediante código y consulta del resumen del graduado.

## Integrantes

- Azael Cardenas
- Angel Galvan
- Hugo Flores


## Cómo ejecutar el backend

1. Instalar .NET SDK y PostgreSQL.
2. En la carpeta `backend/GraduacionWeb.API/GraduacionWeb.API`, configurar los secretos
   (los valores de ejemplo están en `appsettings.example.json`):
```
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<cadena de conexión>"
   dotnet user-secrets set "Jwt:Key" "<clave de al menos 32 caracteres>"
   dotnet user-secrets set "Jwt:Issuer" "GraduacionWeb"
   dotnet user-secrets set "Jwt:Audience" "GraduacionWebUsuarios"
   dotnet user-secrets set "AdminSeed:Email" "<correo del admin>"
   dotnet user-secrets set "AdminSeed:Password" "<contraseña del admin>"
```
3. Crear la base de datos con `Update-Database` (Visual Studio) o `dotnet ef database update`.
4. Ejecutar la API. Swagger abre en `/swagger`.