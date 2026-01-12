'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface MaintenanceData {
    equipmentId: string
    description: string
    partsReplaced?: string
    nextMaintenanceDate?: Date
}

export async function addMaintenanceRecord(data: MaintenanceData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Inserir registro
    const { error } = await supabase
        .from('MaintenanceRecord')
        .insert({
            equipment_id: data.equipmentId,
            technician_id: user.id,
            description: data.description,
            parts_replaced: data.partsReplaced,
            next_maintenance_date: data.nextMaintenanceDate
        })

    if (error) return { error: error.message }

    // Atualizar status do equipamento (opcional, lógica de negócio)
    // Se manutenção feita, status volta pra OK
    await supabase
        .from('MedicalEquipment')
        .update({ status: 'OK' })
        .eq('id', data.equipmentId)

    revalidatePath(`/equipment/${data.equipmentId}`)
    return { success: true }
}

export async function getMaintenanceHistory(equipmentId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('MaintenanceRecord')
        .select(`
            *,
            User (
                name,
                email
            )
        `)
        .eq('equipment_id', equipmentId)
        .order('maintenance_date', { ascending: false })

    if (error) return { error: error.message }
    return { data }
}
