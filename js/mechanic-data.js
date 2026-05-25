import { db } from '../config/supabase.js';
import { getCurrentUser } from './auth.js';

export async function listMyAssignedAppointments() {
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
            km_ingreso,
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
            ),
            appointment_logs (
                id,
                nota,
                visible_para_cliente,
                estatus_nuevo,
                created_at
            )
        `)
        .eq('mecanico_id', user.id)
        .order('fecha_programada', { ascending: true });

    return {
        appointments: data ?? [],
        error
    };
}

export async function updateAppointmentAsMechanic(payload) {
    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
        return { ok: false, error: { message: 'No hay sesión activa.' } };
    }

    const updateData = {
        estatus: payload.estatus,
        diagnostico: payload.diagnostico || null,
        km_ingreso: payload.km_ingreso !== '' ? Number(payload.km_ingreso) : null,
        total_estimado: payload.total_estimado !== '' ? Number(payload.total_estimado) : 0
    };

    const { data: appointment, error: appointmentError } = await db
        .from('appointments')
        .update(updateData)
        .eq('id', payload.appointment_id)
        .select()
        .single();

    if (appointmentError) {
        return { ok: false, error: appointmentError };
    }

    if (payload.nota && payload.nota.trim() !== '') {
        const { error: logError } = await db
            .from('appointment_logs')
            .insert([
                {
                    appointment_id: payload.appointment_id,
                    actor_id: user.id,
                    estatus_nuevo: payload.estatus,
                    nota: payload.nota.trim(),
                    visible_para_cliente: payload.visible_para_cliente === true
                }
            ]);

        if (logError) {
            return { ok: false, error: logError };
        }
    }

    return {
        ok: true,
        appointment
    };
}