import { getDb } from '../config/supabase.js';

export async function listBrandsForAdmin() {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_brands')
        .select('id, nombre, activo, created_at')
        .order('nombre', { ascending: true });

    return { brands: data ?? [], error };
}

export async function createBrand(nombre) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_brands')
        .insert([{ nombre, activo: true }])
        .select()
        .single();

    return { brand: data, error };
}

export async function updateBrand(brandId, nombre) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_brands')
        .update({ nombre })
        .eq('id', brandId)
        .select()
        .single();

    return { brand: data, error };
}

export async function updateBrandStatus(brandId, activo) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_brands')
        .update({ activo })
        .eq('id', brandId)
        .select()
        .single();

    return { brand: data, error };
}

export async function listModelsForAdmin() {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_models')
        .select(`
            id,
            nombre,
            activo,
            brand_id,
            motorcycle_brands (
                id,
                nombre
            )
        `)
        .order('nombre', { ascending: true });

    return { models: data ?? [], error };
}

export async function createModel(payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_models')
        .insert([
            {
                brand_id: Number(payload.brand_id),
                nombre: payload.nombre,
                activo: true
            }
        ])
        .select()
        .single();

    return { model: data, error };
}

export async function updateModel(modelId, payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_models')
        .update({
            brand_id: Number(payload.brand_id),
            nombre: payload.nombre
        })
        .eq('id', modelId)
        .select()
        .single();

    return { model: data, error };
}

export async function updateModelStatus(modelId, activo) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_models')
        .update({ activo })
        .eq('id', modelId)
        .select()
        .single();

    return { model: data, error };
}

export async function listVersionsForAdmin() {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_versions')
        .select(`
            id,
            anio,
            cilindrada,
            activo,
            model_id,
            motorcycle_models (
                id,
                nombre,
                brand_id,
                motorcycle_brands (
                    id,
                    nombre
                )
            )
        `)
        .order('anio', { ascending: false });

    return { versions: data ?? [], error };
}

export async function createVersion(payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_versions')
        .insert([
            {
                model_id: Number(payload.model_id),
                anio: Number(payload.anio),
                cilindrada: Number(payload.cilindrada),
                activo: true
            }
        ])
        .select()
        .single();

    return { version: data, error };
}

export async function updateVersion(versionId, payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_versions')
        .update({
            model_id: Number(payload.model_id),
            anio: Number(payload.anio),
            cilindrada: Number(payload.cilindrada)
        })
        .eq('id', versionId)
        .select()
        .single();

    return { version: data, error };
}

export async function updateVersionStatus(versionId, activo) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_versions')
        .update({ activo })
        .eq('id', versionId)
        .select()
        .single();

    return { version: data, error };
}

export async function listColorsForAdmin() {
    const db = await getDb();
    const { data, error } = await db
        .from('colors')
        .select('id, nombre, hex, activo, created_at')
        .order('nombre', { ascending: true });

    return { colors: data ?? [], error };
}

export async function createColor(payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('colors')
        .insert([
            {
                nombre: payload.nombre,
                hex: payload.hex || null,
                activo: true
            }
        ])
        .select()
        .single();

    return { color: data, error };
}

export async function updateColor(colorId, payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('colors')
        .update({
            nombre: payload.nombre,
            hex: payload.hex || null
        })
        .eq('id', colorId)
        .select()
        .single();

    return { color: data, error };
}

export async function updateColorStatus(colorId, activo) {
    const db = await getDb();
    const { data, error } = await db
        .from('colors')
        .update({ activo })
        .eq('id', colorId)
        .select()
        .single();

    return { color: data, error };
}