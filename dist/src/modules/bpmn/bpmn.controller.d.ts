import type { Response } from 'express';
import { BpmnService } from './bpmn.service';
export declare class BpmnController {
    private readonly bpmnService;
    private readonly logger;
    constructor(bpmnService: BpmnService);
    convertToPng(svg: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
