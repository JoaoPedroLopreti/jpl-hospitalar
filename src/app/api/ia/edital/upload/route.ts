import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/ia/edital/upload
 * Cria registro de edital no banco
 * ⚠️ NÃO processa IA - apenas cria o registro
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
        }

        const body = await request.json()
        const { nome, arquivoUrl } = body

        if (!nome) {
            return NextResponse.json({ success: false, error: 'Nome é obrigatório' }, { status: 400 })
        }

        // Criar edital no banco usando Supabase
        const { data: edital, error } = await supabase
            .from('Edital')
            .insert({
                nome,
                arquivo_url: arquivoUrl || null,
                status: 'UPLOADED',
                created_by: user.id,
            })
            .select()
            .single()

        if (error) {
            console.error('[Upload Edital] Database error:', error)
            throw new Error(`Database error: ${error.message}`)
        }

        if (!edital) {
            throw new Error('Edital created but no data returned')
        }

        console.log('[Upload Edital] Success! Created edital:', edital.id)

        // Log inicial
        await supabase
            .from('LogProcessamento')
            .insert({
                edital_id: edital.id,
                etapa: 'UPLOAD',
                mensagem: 'Edital carregado com sucesso',
            })

        return NextResponse.json({
            success: true,
            editalId: edital.id,
            status: edital.status,
        })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        console.error('[Upload Edital] Error:', errorMessage)
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        )
    }
}
