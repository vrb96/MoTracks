import { getDb } from '../config/supabase.js';

export async function listActiveMechanics() {
    const db = await getDb();
    const { data, error } = await db
        .from('profiles')
        .select('id, nombre, email, activo')
        .eq('rol', 'mecanico')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    return {
        mechanics: data ?? [],
        error
    };
}

export async function listAllAppointmentsForAdmin() {
    const db = await getDb();
    const { data, error } = await db
        .from('appointments')
        .select(`
            id,
            fecha_programada,
            estatus,
            cliente_id,
            mecanico_id,
            observaciones_cliente,
            total_estimado,
            cliente:profiles!appointments_cliente_id_fkey (
                id,
                nombre,
                email
            ),
            mecanico:profiles!appointments_mecanico_id_fkey (
                id,
                nombre,
                email
            ),
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
                service_catalog (
                    id,
                    nombre
                )
            )
        `)
        .order('fecha_programada', { ascending: true });

    return {
        appointments: data ?? [],
        error
    };
}

export async function assignMechanicToAppointment(appointmentId, mechanicId) {
    const db = await getDb();
    const payload = {
        mecanico_id: mechanicId || null
    };

    const { data, error } = await db
        .from('appointments')
        .update(payload)
        .eq('id', appointmentId)
        .select()
        .single();

    return {
        appointment: data,
        error
    };
}