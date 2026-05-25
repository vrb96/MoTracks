import { getDb } from '../config/supabase.js';

export async function listServicesForAdmin() {
    const db = await getDb();
    const { data, error } = await db
        .from('service_catalog')
        .select('id, nombre, descripcion, duracion_minutos, precio_base, activo, created_at')
        .order('nombre', { ascending: true });

    return {
        services: data ?? [],
        error
    };
}

export async function createService(payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('service_catalog')
        .insert([
            {
                nombre: payload.nombre,
                descripcion: payload.descripcion || null,
                duracion_minutos: Number(payload.duracion_minutos),
                precio_base: Number(payload.precio_base),
                activo: true
            }
        ])
        .select()
        .single();

    return {
        service: data,
        error
    };
}

export async function updateService(serviceId, payload) {
    const db = await getDb();
    const { data, error } = await db
        .from('service_catalog')
        .update({
            nombre: payload.nombre,
            descripcion: payload.descripcion || null,
            duracion_minutos: Number(payload.duracion_minutos),
            precio_base: Number(payload.precio_base)
        })
        .eq('id', serviceId)
        .select()
        .single();

    return {
        service: data,
        error
    };
}

export async function updateServiceStatus(serviceId, isActive) {
    const db = await getDb();
    const { data, error } = await db
        .from('service_catalog')
        .update({
            activo: isActive
        })
        .eq('id', serviceId)
        .select()
        .single();

    return {
        service: data,
        error
    };
}