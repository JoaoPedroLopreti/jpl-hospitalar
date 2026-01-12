import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/ia/edital/process
 * Inicia processamento mockado do edital
 * ⚠️ PLACEHOLDER - A IA será plugada aqui futuramente
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
        }

        const body = await request.json()
        const { editalId } = body

        if (!editalId) {
            return NextResponse.json({ success: false, error: 'editalId é obrigatório' }, { status: 400 })
        }

        // Verificar se edital existe
        const { data: edital } = await supabase
            .from('Edital')
            .select('*')
            .eq('id', editalId)
            .single()

        if (!edital) {
            return NextResponse.json({ success: false, error: 'Edital não encontrado' }, { status: 404 })
        }

        // Atualizar status para PROCESSING
        await supabase
            .from('Edital')
            .update({ status: 'PROCESSING' })
            .eq('id', editalId)

        // Criar logs mockados
        await supabase
            .from('LogProcessamento')
            .insert([
                {
                    edital_id: editalId,
                    etapa: 'PROCESSING',
                    mensagem: 'Iniciando processamento do edital',
                },
                {
                    edital_id: editalId,
                    etapa: 'VALIDATION',
                    mensagem: 'Validando formato do arquivo',
                },
            ])

        // 🔌 FUTURE AI INTEGRATION POINT

        return NextResponse.json({
            success: true,
            message: 'Processamento iniciado (mockup)',
        })
    } catch (error) {
        console.error('Erro ao processar:', error)
        return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
    }
}
