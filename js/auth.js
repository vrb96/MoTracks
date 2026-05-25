import { db } from '../config/supabase.js';

export async function login(email, password) {
    const { data, error } = await db.auth.signInWithPassword({
        email,
        password
    });

    return { data, error };
}

export async function registerUser(nombre, email, password) {
    const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre
            },
            emailRedirectTo: window.location.origin + '/index.html'
        }
    });

    return { data, error };
}

export async function logout() {
    const { error } = await db.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const { data, error } = await db.auth.getUser();

    return {
        user: data?.user ?? null,
        error
    };
}

export async function getProfile(userId) {
    const { data, error } = await db
        .from('profiles')
        .select('nombre, rol, activo, email')
        .eq('id', userId)
        .single();

    return {
        profile: data,
        error
    };
}

export function getRolePage(role) {
    if (role === 'cliente') return 'cliente.html';
    if (role === 'mecanico') return 'mecanico.html';
    if (role === 'admin') return 'admin.html';
    return 'index.html';
}

export async function redirectByRole(userId) {
    const { profile, error } = await getProfile(userId);

    if (error || !profile) {
        return {
            ok: false,
            message: 'No se encontró el perfil del usuario en profiles.'
        };
    }

    if (profile.activo === false) {
        await logout();
        return {
            ok: false,
            message: 'Tu usuario está inactivo.'
        };
    }

    const page = getRolePage(profile.rol);

    if (page === 'index.html') {
        return {
            ok: false,
            message: 'El rol del usuario no es válido.'
        };
    }

    window.location.href = page;

    return {
        ok: true,
        profile
    };
}

export async function requireAuth() {
    const { user, error } = await getCurrentUser();

    if (error || !user) {
        window.location.href = 'index.html';
        return null;
    }

    return user;
}

export async function requireRole(expectedRole) {
    const user = await requireAuth();

    if (!user) return null;

    const { profile, error } = await getProfile(user.id);

    if (error || !profile) {
        window.location.href = 'index.html';
        return null;
    }

    if (profile.activo === false) {
        await logout();
        window.location.href = 'index.html';
        return null;
    }

    if (profile.rol !== expectedRole) {
        window.location.href = getRolePage(profile.rol);
        return null;
    }

    return { user, profile };
}

export async function redirectIfSessionExists() {
    const { user } = await getCurrentUser();

    if (!user) return false;

    const result = await redirectByRole(user.id);
    return result.ok;
}

export async function listUsers() {
    const { data, error } = await db
        .from('profiles')
        .select('id, nombre, email, rol, activo, created_at')
        .order('created_at', { ascending: false });

    return { users: data ?? [], error };
}

export async function updateUserRole(userId, newRole) {
    const { data, error } = await db
        .from('profiles')
        .update({ rol: newRole })
        .eq('id', userId)
        .select('id, nombre, email, rol, activo, created_at')
        .single();

    return { user: data, error };
}

export async function updateUserStatus(userId, isActive) {
    const { data, error } = await db
        .from('profiles')
        .update({ activo: isActive })
        .eq('id', userId)
        .select('id, nombre, email, rol, activo, created_at')
        .single();

    return { user: data, error };
}