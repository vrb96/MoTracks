const SUPABASE_URL = 'https://uzqnsnaolfbgqwnxuljg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_2QK6-1vbeCFCn5TdlPt7Lg_e7CspsCL';

let db = null;

async function initSupabase() {
    if (db) return db;

    // Esperar a que el CDN de Supabase cargue
    const maxAttempts = 50;
    let attempts = 0;

    while (!window.supabase && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (!window.supabase) {
        throw new Error('Supabase CDN no se cargó correctamente');
    }

    const { createClient } = window.supabase;
    db = createClient(SUPABASE_URL, SUPABASE_KEY);
    return db;
}

export const getDb = async () => {
    if (!db) {
        await initSupabase();
    }
    return db;
};