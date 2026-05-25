import { getDb } from '../config/supabase.js';
import { getCurrentUser } from './auth.js';

export async function listMyMotorcycles() {
    const db = await getDb();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { motorcycles: [], error: { message: 'No hay sesión activa.' } };
    }

    const { data, error } = await db
        .from('motorcycles')
        .select(`
            id,
            brand_id,
            model_id,
            version_id,
            color_id,
            placas,
            kilometraje,
            notas,
            activo,
            created_at,
            motorcycle_brands (
                id,
                nombre
            ),
            motorcycle_models (
                id,
                nombre
            ),
            motorcycle_versions (
                id,
                anio,
                cilindrada
            ),
            colors (
                id,
                nombre,
                hex
            )
        `)
        .eq('cliente_id', user.id)
        .eq('activo', true)
        .order('created_at', { ascending: false });

    return {
        motorcycles: data ?? [],
        error
    };
}

export async function createMotorcycle(payload) {
    const db = await getDb();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { motorcycle: null, error: { message: 'No hay sesión activa.' } };
    }

    const { data, error } = await db
        .from('motorcycles')
        .insert([
            {
                cliente_id: user.id,
                brand_id: payload.brand_id,
                model_id: payload.model_id,
                version_id: payload.version_id,
                color_id: payload.color_id,
                placas: payload.placas || null,
                kilometraje: payload.kilometraje || null,
                notas: payload.notas || null
            }
        ])
        .select()
        .single();

    return {
        motorcycle: data,
        error
    };
}

export async function listBrands() {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_brands')
        .select('id, nombre')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    return {
        brands: data ?? [],
        error
    };
}

export async function listModelsByBrand(brandId) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_models')
        .select('id, nombre, brand_id')
        .eq('activo', true)
        .eq('brand_id', brandId)
        .order('nombre', { ascending: true });

    return {
        models: data ?? [],
        error
    };
}

export async function listVersionsByModel(modelId) {
    const db = await getDb();
    const { data, error } = await db
        .from('motorcycle_versions')
        .select('id, model_id, anio, cilindrada')
        .eq('activo', true)
        .eq('model_id', modelId)
        .order('anio', { ascending: false });

    return {
        versions: data ?? [],
        error
    };
}

export async function listColors() {
    const db = await getDb();
    const { data, error } = await db
        .from('colors')
        .select('id, nombre, hex')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    return {
        colors: data ?? [],
        error
    };
}

export async function listActiveServices() {
    const db = await getDb();
    const { data, error } = await db
        .from('service_catalog')
        .select('id, nombre, descripcion, duracion_minutos, precio_base')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    return {
        services: data ?? [],
        error
    };
}

export async function createAppointment(payload) {
    const db = await getDb();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { appointment: null, error: { message: 'No hay sesión activa.' } };
    }

    const isoDate = new Date(payload.fecha_programada).toISOString();

    const { data: appointment, error: appointmentError } = await db
        .from('appointments')
        .insert([
            {
                cliente_id: user.id,
                motorcycle_id: payload.motorcycle_id,
                fecha_programada: isoDate,
                observaciones_cliente: payload.observaciones_cliente || null,
                estatus: 'pendiente',
                total_estimado: 0
            }
        ])
        .select()
        .single();

    if (appointmentError || !appointment) {
        return { appointment: null, error: appointmentError };
    }

    if (payload.services && payload.services.length > 0) {
        const rows = payload.services.map(service => ({
            appointment_id: appointment.id,
            service_id: Number(service.id),
            cantidad: Number(service.cantidad) || 1,
            precio_unitario: Number(service.precio_base) || 0
        }));

        const { error: servicesError } = await db
            .from('appointment_services')
            .insert(rows);

        if (servicesError) {
            return { appointment: null, error: servicesError };
        }
    }

    return {
        appointment,
        error: null
    };
}

export async function listMyAppointments() {
    const db = await getDb();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { appointments: [], error: { message: 'No hay sesión activa.' } };
    }

    const { data, error } = await db
        .from('appointments')
        .select(`
            id,
            fecha_programada,
            estatus,
            observaciones_cliente,
            diagnostico,
            total_estimado,
            motorcycles (
                id,
                placas,
                motorcycle_brands (
                    id,
                    nombre
                ),
                motorcycle_models (
                    id,
                    nombre
                ),
                motorcycle_versions (
                    id,
                    anio,
                    cilindrada
                ),
                colors (
                    id,
                    nombre
                )
            ),
            appointment_services (
                id,
                cantidad,
                precio_unitario,
                service_catalog (
                    id,
                    nombre
                )
            )
        `)
        .eq('cliente_id', user.id)
        .order('fecha_programada', { ascending: false });

    return {
        appointments: data ?? [],
        error
    };
}

export async function deleteMyMotorcycle(motorcycleId) {
    const db = await getDb();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { ok: false, error: { message: 'No hay sesión activa.' } };
    }

    const { data, error } = await db
        .from('motorcycles')
        .update({ activo: false })
        .eq('id', motorcycleId)
        .eq('cliente_id', user.id)
        .select('id')
        .single();

    if (error) {
        return { ok: false, error };
    }

    return { ok: true, motorcycle: data };
}

export async function updateMyMotorcycle(payload) {
    const db = await getDb();
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { ok: false, error: { message: 'No hay sesión activa.' } };
    }

    const { data, error } = await db
        .from('motorcycles')
        .update({
            brand_id: payload.brand_id,
            model_id: payload.model_id,
            version_id: payload.version_id,
            color_id: payload.color_id,
            placas: payload.placas || null,
            kilometraje: payload.kilometraje || null,
            notas: payload.notas || null
        })
        .eq('id', payload.id)
        .eq('cliente_id', user.id)
        .eq('activo', true)
        .select()
        .single();

    if (error) {
        return { ok: false, error };
    }

    return { ok: true, motorcycle: data };
}