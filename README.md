# Primer proyecto con Nestjs
Vamos a instalar el CLI de nest.js  (https://docs.nestjs.com/)
```bash
$ npm i -g @nestjs/cli
Which package manager would you ❤️  to use?  -> seleccionamos "npm"
```

Ahora creamos un nuevo proyecto NestJS
```bash
$ nest new [project_directory]
```

El proyecto creado por el CLI de NestJs crea la siguiente estructura de directorios:

- **/node_modules:**  Aqui se encuentran instaladas todas las dependencias del proyecto
- **/scr:** Aqui se encontrara todo el codigo de nuestra aplicacion
- **/test:** Este es el directorio donde programaremos las pruebas unitarias y de integracion
- **.eslintrc.js:** Es una herramienta que permite el analisis de codigo estatico, esto nos ayuda a identificar patrones con errores en el codigo
- **.gitignore:** Archivo para colocar archivos y/o directorios que no seran trackeados por GIT
- **.prettyerrc:** Archivo para configuracion de impresion de errores
- **nest-cli.json:** Configuracion de NestJS CLI 

### COMANDOS BASICOS DE LA APLICACION
Para saber los comandos que vamos a poder ejecutar, revisamos el archivo package.json, y los que mas vamos a usar son:
```bash
# Compila el codigo
$ npm run build
# Inicia el servidor
$ npm run start
# Inicia el servidor en modo desarrollo
$ npm run start:dev
# Inicia el servidor en modo produccion
$ npm run start:prod
```

### CREACION DE UN CONTROLADOR CON NEST CLI
Con el comando
```bash
$ nest --help
```

podremos ver la ayuda del CLI de nest
```bash
$ nest generate controller nombreControlador
````

Podemos colocar el mismo comando de manera abreviada de la siguiente manera

```bash
$ nest g co nombreControlador
```
> NOTA: Si queremos ya trabajar con una estructura mas ordenada, podemos ejecutar el comando de la siguiente manera:
```bash
$ nest g co api/v1/users
```
Esto creara el controlador **users.controller.ts** dentro de los directorios **/src/api/v1**

Esto generara dentro de **"/src"** un directorio con el nombre del controlador que hayamos colocado

Dentro de este directorio estaran 2 archivos:
- nombreControlador.controller.spec.ts  -> archivos de pruebas
- nombreControlador.controller.ts       -> controlador como tal

Para nuestra aplicacion vamos a crear el controlador para gestionar tareas:
```bash
$ nest g co api/v1/task
```

Luego cambiaremos dentro del controlador
```javascript
@Controller('task')
```
por
```javascript
@Controller('api/v1/task')
```

Generando el controlador con el CLI de NEST, el archivo app.module.ts queda actualizado incluyendo nuestro nuevo controlador 
sutomaticamente

### CONFIGURACION DE MODULO
Ahora vamos a crear un modulo para poder manejar nuestro modulo de la aplicacion de tareas, independiente a nuestro app.module 
para que en caso de que la aplicacion crezca, no se vuelva un problema darle mantenimiento

primero vamos a generar el servide de nuestro modulo task:
```bash
$ nest g s api/v1/task
```

Para generar nuestro modulo ejecutaremos:
```bash
$ nest g mo api/v1/task
```

Ahora en nuestro task.module vamos a importar los controllers y providers, y los vamos a quitar de app.module
En app.module dejamos **"imports: [TaskModule],"** para utilizar TaskModule para importar nuestro controller y service

Ahora, para poder usar nuestra aplicacion vamos a necesitar datos de transferencia, para eso lo primero que vamos
a hacer es crear dentro de **"api/v1/task"** un directorio llamado **"dto"** y dentro de este directorio creamos el archivo 
task.dto.ts con el siguiente contenido:

```javascript
export class TaskDTO{
    readonly description: string;
    readonly isDone: boolean;
}
```

Para generar metodos con verbos HTTP dentro del controlador, fuera de la clase realizamos estas importaciones:

```javascript
import { Controller, Post, Get, Req, Put, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { Request } from 'express';
```

Luego dentro de la clase incluimos estos metodos

```javascript
@Get()
methodList(@Req() req:Request ){
    return `method ${req.method}`;
}
    
// Si necesitamos que el metodo tenga mas segmentos en su URL lo hacemos de la siguiente manera
@Get('edit')
methodEdit(@Req() req:Request ){
    return `method ${req.method} edit`;
}

@Get('show/:id')
methodShow(@Param('id') id:string ){
    //return `id: ${ id }`;
    // Para devolverlo en formato JSON
    return { id };
}

@Get('show2/:id/:state')
methodShow2(@Param() data:any ){
    //return `id: ${ id }`;
    // Para devolverlo en formato JSON
    return { data };
}

@Get('show3/:id/:description/:isdone')
methodShow3(
    @Param('id') id:number, 
    @Param('description') description:string, 
    @Param('isdone') isdone:boolean 
){
    //return `id: ${ id }`;
    // Para devolverlo en formato JSON
    return { id, description, isdone };
}

@Get('show4')
methodQuery(
    @Query('id') id:number, 
    @Query('description') description:string, 
    @Query('isdone') isdone:boolean,
    @Query('name') name:string 
){
    return { id, description, isdone, name };
}

@Get('show5')
methodQuery2(
    @Query() param:any
){
    return { param };
}

@Post()
methodPost(@Req() req:Request ){
    return `method ${req.method}`;
}

@Post('body')
methodBopdy(@Body() body:any ){
    return body;
}

@Put()
methodPut(@Req() req:Request ){
    return `method ${req.method}`;
}

@Patch()
methodPatch(@Req() req:Request ){
    return `method ${req.method}`;
}

@Delete()
methodDelete(@Req() req:Request ){
    return `method ${req.method}`;
}
```

Para generar UUID vamos a instalar el siguiente paquete:

```bash
$ npm install uuid
```

Para validar datos vamos a instalar 2 dependencias:

```bash
$ npm i class-validator class-transformer
```
    
Una vez instalados, colocamos el decorador UsePipes de nest commons, y dentro instanciamos la clase ValidationPipe
tambien de nest commons, y quedaria de la siguiente manera

```javascript        
@Post()
@UsePipes(new ValidationPipe())
store(@Body() taskDTO: TaskDTO){
    return this._taskService.create(taskDTO);
}
```

Una vez hecho esto, debemos modificar el DTO de la siguiente manera:

```javascript
import { IsNotEmpty, IsString, IsBoolean, MinLength } from 'class-validator';
export class TaskDTO{
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    readonly description: string;

    @IsNotEmpty()
    @IsBoolean()
    readonly isDone: boolean;
}
```

De esta manera tendriamos que validar metodo por metodo, para hacerlo de manera global
debemos hacer lo siguiente en el archivo **main.ts**

dentro del metodo bootstrap() de main.ts agregamos esta linea

```javascript
app.useGlobalPipes(new ValidationPipe);
```
    
Obviamente debera ir luego de la declaracion de **"app"**

Ahora podemos quitar esta linea del metodo store del controlador:

```javascript
@UsePipes(new ValidationPipe())
```
    

### MANEJO DE EXCEPCIONES
Para el primer ejemplo vamos a coloca el siguiente codigo dentro de cualquier metodo del controlador, 
que lo que hara es simplkemente simular que esta procesando y luego devolvera un mesnaje de error:

```javascript
return new Promise((resolve, reject) => {
    setTimeout(() => reject('Request Err. 1'), 3000);
});
```
    
Si probamos el metodo desde POSTMAN recibiremos un Internal Server Error con Status Code 500, pero no 
veremos el mensaje que se encuentra ahi, el cual si quedara registrado en ExceptionHandler ya que 
esta clase intercepto el error

Otra manera de manejar excepciones es colocar en cada metodo de los controladores algo como esto:
        
```javascript
throw new HttpException('Request Err. 1', HttpStatus.BAD_REQUEST);
```
    
O esto:

```javascript
throw new BadRequestException('Error en los parametros enviados en la peticion');
```

Sin embargo para manejarlo de manera global, vamos a hacer lo siguiente:

- Dentro de "src" creamos el directorio "common" (Esto es opcional sin embargo lo hacemos para mantener orden y llevar buenas
  practicas de desarrollo)
- Dentro de "src/common" creamos un directorio "filters"
- Y dentro de "src/common/filters" vamos a crear el archivo: http-exception.filter.ts
- Una vez programado el archivo, vamos a main.ts y colocamos este filtro de forma global agregando la siguiente linea

  ```javascript
  app.useGlobalFilters(new AllExceptionFilter());
  ```

Ahora podemos volver a probar el metodo del controlador usando este codigo:

```javascript
return new Promise((resolve, reject) => {
    setTimeout(() => reject('Request Err. 1'), 3000);
});
```

Y ya recibiremos el mensaje que hemos configurado ahi.


### USO DE INTERCEPTORES DE NEST JS
Para este ejemplo vamos a simular que una petición esta tomando demasiado tiempo en responder, y vamos a interceptar
ese proceso para dar una respuesta en caso de que no exista una repsuesta por parte del servicio

Vamos al controlador y vamos a retornar una promesa en uno de los metodos de la siguiente manera:

```javascript
return new Promise((resolve, reject) => {
    setTimeout(() => reject('Something was wrong'), 15000);
});
```

Con este codigo, el servicio respondera con el error "Something went wrong" luego de 15 segundos, entonces vamos
a interceptar ese timeout

Creamos el directorio **"scr/common/interceptors"**, y dentro de interceptors creamos el archivo **timeout.interceptor.ts** el cual tendrá el siguiente codigo:

##### scr/common/interceptors/timeout.interceptor.ts
```javascript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor
{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(timeout(3000));
    }
    
}
```

Ahora vamos a instanciar esta clase en nuestro archivo principal que es main.js de la siguiente manera:

```javascript
app.useGlobalInterceptors(new TimeoutInterceptor());
```

Ahora el interceptor esperará un máximo de 3 segundos antes de responder con un timeout.
