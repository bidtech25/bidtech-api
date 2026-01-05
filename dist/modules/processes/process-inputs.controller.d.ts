import { ProcessesService } from './processes.service';
export declare class ProcessInputsController {
    private readonly service;
    constructor(service: ProcessesService);
    addInput(processId: string, dto: {
        name: string;
        description?: string;
        source?: string;
    }, userId: string): any;
    removeInput(processId: string, inputId: string, userId: string): any;
}
