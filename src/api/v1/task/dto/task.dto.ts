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