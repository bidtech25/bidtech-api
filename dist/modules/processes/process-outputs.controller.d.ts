import { ProcessesService } from './processes.service';
export declare class ProcessOutputsController {
    private readonly service;
    constructor(service: ProcessesService);
    addOutput(processId: string, dto: {
        name: string;
        description?: string;
        destination?: string;
    }, userId: string): any;
    removeOutput(processId: string, outputId: string, userId: string): any;
}
