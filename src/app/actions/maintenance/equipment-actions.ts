'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface EquipmentData {
    companyId: string
    name: string
    brand: string
    model: string
    serialNumber: string
    location?: string
    installDate?: Date
}

export async function registerEquipment(data: EquipmentData) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('MedicalEquipment')
        .insert({
            company_id: data.companyId,
            name: data.name,
            brand: data.brand,
            model: data.model,
            serial_number: data.serialNumber,
            location: data.location,
            install_date: data.installDate,
            status: 'OK'
        })

    if (error) return { error: error.message }

    revalidatePath('/dashboard/technician/equipment')
    revalidatePath(`/dashboard/technician/companies/${data.companyId}`)
    return { success: true }
}

export async function getEquipment(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('MedicalEquipment')
        .select(`
            *,
            MaintenanceCompany (
                trade_name,
                email,
                phone
            )
        `)
        .eq('id', id)
        .single()

    if (error) return { error: error.message }
    return { data }
}

export async function listEquipmentByCompany(companyId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('MedicalEquipment')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { data }
}

export async function updateEquipmentStatus(id: string, status: 'OK' | 'MAINTENANCE_DUE' | 'EXPIRED' | 'UNDER_MAINTENANCE') {
    const supabase = await createClient()

    const { error } = await supabase
        .from('MedicalEquipment')
        .update({ status })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/technician/equipment')
    return { success: true }
}
