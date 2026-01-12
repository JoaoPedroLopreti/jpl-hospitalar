'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signIn(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signUp(email: string, password: string, name: string, role: 'EMPLOYEE' | 'ADMIN' = 'EMPLOYEE') {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Buscar dados completos do usuário na tabela User
    const { data: userData } = await supabase
        .from('User')
        .select('*')
        .eq('id', user.id)
        .single()

    return userData
}
