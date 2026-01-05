import { ProcessStepDto } from '../process-step.dto';
declare class SipocDto {
    suppliers?: string[];
    inputs?: string[];
    outputs?: string[];
    customers?: string[];
}
export declare class UpdateDetailsDto {
    steps?: ProcessStepDto[];
    sipoc?: SipocDto;
}
export {};
