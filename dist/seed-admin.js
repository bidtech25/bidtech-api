"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : path.resolve(__dirname, '../.env') });
const prisma = new client_1.PrismaClient();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_JWT_SECRET;
if (!process.env.SUPABASE_URL || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_JWT_SECRET in .env");
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, serviceRoleKey);
async function main() {
    const email = 'admin@bidtech.internal';
    const password = 'Mudar@123';
    const name = 'Super Admin';
    console.log(`Creating Super Admin: ${email}`);
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: 'SUPER_ADMIN', is_first_login: true },
    });
    if (error) {
        if (!error.message?.includes('already registered')) {
            console.error('Supabase Auth Error:', error.message);
        }
        else {
            console.log("User already in Supabase Auth.");
        }
    }
    let userId = data?.user?.id;
    if (!userId) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const found = users?.users?.find((u) => u.email === email);
        if (found)
            userId = found.id;
    }
    if (!userId) {
        console.error('Could not determine User ID. Exiting.');
        return;
    }
    console.log(`Supabase User ID: ${userId}`);
    const profile = await prisma.profile.upsert({
        where: { id: userId },
        update: {
            role: client_1.Role.SUPER_ADMIN,
        },
        create: {
            id: userId,
            email,
            name,
            role: client_1.Role.SUPER_ADMIN,
        },
    });
    console.log('Super Admin Profile Configured:', profile);
}
main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=seed-admin.js.map