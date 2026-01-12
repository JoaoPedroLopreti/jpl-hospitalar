'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createCompany(data: {
    legalName: string
    tradeName: string
    cnpj: string
    email: string
    phone: string
    password?: string // Opcional, ou gerado auto
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verificar se user é TECHNICIAN
    // (Melhoria: Adicionar helper getUserRole)
    const { data: userRole } = await supabase
        .from('User')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userRole?.role !== 'TECHNICIAN' && userRole?.role !== 'ADMIN') {
        return { error: 'Forbidden: Only Technicians can create companies' }
    }

    const adminClient = createAdminClient()
    const password = data.password || 'Mudar123!' // Senha padrão ou gerada

    // 1. Criar usuário no Auth (Admin)
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email: data.email,
        password: password,
        email_confirm: true,
        user_metadata: {
            name: data.tradeName, // Assegurar que o nome está aqui
            role: 'COMPANY' // Agora podemos ir direto
        }
    })

    if (authError) {
        return { error: `Failed to create auth user: ${authError.message}` }
    }

    if (!authUser.user) return { error: 'Failed to create auth user' }

    // 2. INSERIR MANUALMENTE NA TABELA "User" (Sem trigger)
    const { error: publicInsertError } = await adminClient
        .from('User')
        .insert({
            id: authUser.user.id,
            email: data.email,
            name: data.tradeName,
            role: 'COMPANY'
        })

    if (publicInsertError) {
        console.error('Falha ao inserir na tabela pública:', publicInsertError)
        // Rollback do auth se falhar no público
        await adminClient.auth.admin.deleteUser(authUser.user.id)
        return { error: `Database error (Public Table): ${publicInsertError.message}` }
    }



    // 2. Criar registro na tabela MaintenanceCompany
    const { error: dbError } = await supabase
        .from('MaintenanceCompany')
        .insert({
            user_id: authUser.user.id,
            technician_id: user.id,
            legal_name: data.legalName,
            trade_name: data.tradeName,
            cnpj: data.cnpj,
            email: data.email,
            phone: data.phone
        })

    if (dbError) {
        // Rollback auth user if possible (delete)
        await adminClient.auth.admin.deleteUser(authUser.user.id)
        return { error: `Database error: ${dbError.message}` }
    }

    revalidatePath('/dashboard/technician/companies')
    return { success: true, companyId: authUser.user.id }
}

export async function getCompanies() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data, error } = await supabase
        .from('MaintenanceCompany')
        .select('*')
        .eq('technician_id', user.id)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }

    return { data }
}
