require('dotenv').config();

console.log('--- ENV DEBUG ---');
console.log('Current Directory:', process.cwd());
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Key Length:', process.env.SUPABASE_SERVICE_ROLE_KEY.length);
  console.log('Starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 5) + '...');
} else {
  console.log('❌ KEY NOT FOUND');
}
console.log('-----------------');
