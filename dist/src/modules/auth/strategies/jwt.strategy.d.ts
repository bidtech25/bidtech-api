import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { JwtPayload, RequestUser } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    private usersService;
    private readonly logger;
    constructor(config: ConfigService, usersService: UsersService);
    validate(payload: JwtPayload): Promise<RequestUser>;
}
export {};
