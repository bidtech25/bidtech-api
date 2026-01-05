require('dotenv').config();

console.log('--- AUTH ENV DEBUG ---');
console.log('SUPABASE_JWT_SECRET exists:', !!process.env.SUPABASE_JWT_SECRET);
if (process.env.SUPABASE_JWT_SECRET) {
  console.log('Key Length:', process.env.SUPABASE_JWT_SECRET.length);
} else {
  console.log('❌ SUPABASE_JWT_SECRET NOT FOUND - Backend will use FALLBACK_SECRET and fail validation');
}
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('-----------------');
