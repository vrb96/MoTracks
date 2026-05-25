const SUPABASE_URL = 'https://uzqnsnaolfbgqwnxuljg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2QK6-1vbeCFCn5TdlPt7Lg_e7CspsCL';

const { createClient } = supabase;

export const db = createClient(SUPABASE_URL, SUPABASE_KEY);