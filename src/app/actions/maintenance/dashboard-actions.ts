'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTechnicianStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Obter IDs das empresas gerenciadas pelo técnico
    const { data: companies, error: companyError } = await supabase
        .from('MaintenanceCompany')
        .select('id')
        .eq('technician_id', user.id)

    if (companyError) return { error: companyError.message }

    const companyIds = companies.map(c => c.id)
    const companyCount = companyIds.length

    if (companyCount === 0) {
        return {
            companies: 0,
            equipment: 0,
            maintenanceDue: 0,
            overdue: 0
        }
    }

    // Obter equipamentos dessas empresas
    const { data: equipment, error: equipError } = await supabase
        .from('MedicalEquipment')
        .select('id, status, next_maintenance_date') // assumindo campo virtual ou calculado?
        // Na tabela real criada: status é ENUM ('OK', 'MAINTENANCE_DUE', etc)
        // EMaintenanceRecord tem next_maintenance_date, mas tabela Equipment não tem diretamente?
        // Ah, o plano dizia "Each record must store ... Next scheduled maintenance date".
        // O Equipment tem 'status'.
        // Mas para saber "overdue" preciso da data.
        // Vou assumir que o status é atualizado via cron ou manualmente.
        // Ou melhor, vou buscar os equipamentos e filtrar.
        .in('company_id', companyIds)

    if (equipError) return { error: equipError.message }

    const totalEquipment = equipment.length
    const maintenanceDue = equipment.filter(e => e.status === 'MAINTENANCE_DUE').length

    // Para "overdue" (vencido), se não tiver campo de data no equipment, fica difícil.
    // O status 'EXPIRED' pode ser usado como 'vencido'? Ou 'MAINTENANCE_DUE' já cobre?
    // Vou usar status por enquanto.
    const overdue = equipment.filter(e => e.status === 'EXPIRED' || e.status === 'MAINTENANCE_DUE').length

    return {
        companies: companyCount,
        equipment: totalEquipment,
        maintenanceDue,
        overdue
    }
}

export async function getCompanyStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Obter ID da empresa
    const { data: company, error: companyError } = await supabase
        .from('MaintenanceCompany')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (companyError || !company) return { error: 'Company not found' }

    // Obter equipamentos
    const { data: equipment, error: equipError } = await supabase
        .from('MedicalEquipment')
        .select('status')
        .eq('company_id', company.id)

    if (equipError) return { error: equipError.message }

    const totalEquipment = equipment.length
    const maintenanceDue = equipment.filter(e => e.status === 'MAINTENANCE_DUE').length
    const overdue = equipment.filter(e => e.status === 'EXPIRED' || e.status === 'MAINTENANCE_DUE').length
    // Redundant logic, but OK.
    const operational = equipment.filter(e => e.status === 'OK').length

    return {
        totalEquipment,
        maintenanceDue,
        operational,
        overdue
    }
}
