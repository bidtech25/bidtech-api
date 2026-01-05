import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { JwtPayload, RequestUser } from '../interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    constructor(config: ConfigService);
    validate(payload: JwtPayload): Promise<RequestUser>;
}
export {};
