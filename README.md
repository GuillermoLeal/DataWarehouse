# Data Warehouse

Simple template de una herramienta que permite a una compañía de Marketing administrar todos los contactos de sus clientes para sus campañas.

## Comenzando 🚀

_Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas._

### Pre-requisitos 📋

Tener instalado [MySQL](https://www.mysql.com/), si no lo tienes puedes descargar un paquete como [XAMPP](https://www.apachefriends.org/es/index.html), [WampServer](https://www.wampserver.com/en/) o [MAPM](https://www.mamp.info/en/windows/)

Tener instalado [NodeJS](https://nodejs.org/en/)

### Instalación 🔧

Primero crea la base de datos e importa el archivo **data-warehouse.sql** que se encuentra en la raíz del proyecto a la base de datos que creaste

Ahora crea un archivo **.env** con las siquientes variables (Ejemplo de configuracion)

```
# Nombre de usuario de la base de datos
DB_USER=your_username

# Contraseña de la base de datos
DB_PASSWORD=your_password

# Nombre de la base de datos
DB_DATABASE=data-warehouse

# Host donde corre la base de datos
DB_HOST=localhost

# Puerto donde correra la aplicacion
PORT=3000

# Secreto del JWT a utilizar, puede ser cualquier string
TOKEN_SECRET=tu_jwt_secret
```

Ingresa a la ruta del proyecto 'src/client' y ejecuta el siguiente comando para instalar las dependencias del Frontend

```
npm install
```

Ingresa a la ruta del proyecto 'src/server' y ejecuta el siguiente comando para instalar las dependencias del Backend

```
npm install
```

Ejecuta los siguientes comandos en las carpetas respectivas para correr el proyecto:

```
- 'src/client' para el Front:
npm run serve

-'src/server' para el Back:
npm run start

- Si tienes instalado nodemon en el proyecto puedes ejecutar este otro comando para el Back:

npm run dev
```

## Construido con 🛠️

Herramientas usadas en el proyecto\_

- [NodeJS](https://nodejs.org/en/) - Lenguaje usado en el back-end
- [NPM](https://www.npmjs.com/) - Manejador de dependencias
- [Express](https://expressjs.com/es/) - Usado para infraestructura de la API
- [Sequelize](https://sequelize.org/) - ORM usado para la estructura y consulta a la base de datos
- [jsonwebtoken](https://jwt.io/) - Usado para la autenticación
- [VueJS](https://vuejs.org/) - Usado para la arquitectura del Frontend
- [Vuetify](https://vuetifyjs.com/en/) - Usado para los componentes y estilos
- [Axios](https://github.com/axios/axios) - Usado para la comunicacion entre el Front y Back

## Informacion Adicional 📖

Si desea ingresar se tienen 2 usuarios de prueba:

- **ADMIN**
  email: admin@gmail.com
  password: admin123

- **BASICO**
  email: jhon@gmail.com
  password: jhon123
