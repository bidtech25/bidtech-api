declare const _default: (() => {
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    keyPrefix: string;
    retryStrategy: (times: number) => number;
    maxRetriesPerRequest: number;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    keyPrefix: string;
    retryStrategy: (times: number) => number;
    maxRetriesPerRequest: number;
}>;
export default _default;
