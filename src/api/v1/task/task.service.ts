import { TaskDTO } from './dto/task.dto';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ITask } from './task.interface';

@Injectable()
export class TaskService {
    
    tasks: ITask[]=[];
    
    findAll(): ITask[]{
        return this.tasks;
    }

    find(id: string): ITask{
        return this.tasks.find( (t) => t.id === id );
    }

    create(taskDTO:TaskDTO): ITask{
        const task = {
            id: uuidv4(),
            ...taskDTO,
        };
        this.tasks.push(task);
        return task;
    }

    update(id: string, taskDTO: TaskDTO): ITask{
        const task = {
            id: id,
            ...taskDTO,
        };
        this.tasks = this.tasks.map( (t) => (t.id === id ? task : t) );
        return task;
    }

    destroy(id: string): string{
        this.tasks = this.tasks.filter( (t) => t.id !== id );
        return 'Task deleted';
    }

}
