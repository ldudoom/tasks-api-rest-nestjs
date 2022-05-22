import { ArgumentsHost, Catch, ExceptionFilter, Logger, HttpException, HttpStatus } from '@nestjs/common';

// Colocamos el decorador @Catch que viene de nestjs/common
@Catch()
// Creamos la clase e implementamos la interface ExceptionFilter
export class AllExceptionFilter implements ExceptionFilter{
    // Iniciamos una variable logger
    private readonly _logger = new Logger(AllExceptionFilter.name);

    // Implementamos el metodo catch de la interfaz ExceptionFilter
    catch(exception: any, host: ArgumentsHost) {
        // creamos un contexto
        const context = host.switchToHttp();
        // Obtenemos un response del contexto
        const response = context.getResponse();
        // Obtenemos un request del contexto
        const request = context.getRequest();

        // Vamos a crear 2 constantes para verificar si el estado lo estamos recibiendo, si es asi lo mostramos, 
        // caso contrario retornamos un estado por defecto

        // Creamos la constante para capturar el estado, caso contrario colocamos un estado por defecto
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        // Ahora creamos una constante para el mensaje
        const message = exception instanceof HttpException ? exception.getResponse() : exception;

        // Ahora vamos a utilizar nuestra variable logger para guardar el status code y el mensaje recibidos
        this._logger.error(`Status Code: ${status} | Error: ${JSON.stringify(message)}`);

        response.status(status).json({
            time: new Date().toISOString(),
            path: request.url,
            error: message
        });

    }
    
}