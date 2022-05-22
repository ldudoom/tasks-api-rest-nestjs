import { Controller, Post, Get, Put, Delete, Param, Body, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { TaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';

@Controller('api/v1/task')
export class TaskController {    
    
    constructor(private readonly _taskService: TaskService){}

    @Get()
    list(){
        return this._taskService.findAll();
    }

    @Get(':id')
    show(@Param('id') id:string ){
        return this._taskService.find(id);
    }

    @Post()
    store(@Body() taskDTO: TaskDTO){
        
        // Cuando hagamos un request a este metodo, el servidor devolvera un "Internal Server Error" con statusCode 500
        // debido a que este error lo intercepta ExceptionHandler, donde si estara almacenado nuestro mensaje "Request Err. 1"
        /*return new Promise((resolve, reject) => {
            setTimeout(() => reject('Request Err. 1'), 3000);
        });*/
        
        // Para devolver el mensaje que deseamos, lo manejamos de la siguiente manera:
            //throw new HttpException('Request Err. 1', HttpStatus.BAD_REQUEST);
        // Podemos hacer lo mismo de la siguiente manera:
            //throw new BadRequestException('Error en los parametros enviados en la peticion');

        // Simulando que el servicio no responde para ver la funcionalidad de los interceptores:
        return new Promise((resolve, reject) => {
            setTimeout(() => reject('Something went wrong'), 15000);
        });

        return this._taskService.create(taskDTO);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() taskDTO: TaskDTO){
        return this._taskService.update(id, taskDTO);
    }

    @Delete(':id')
    delete(@Param('id') id:string){
        return this._taskService.destroy(id);
    }
}
