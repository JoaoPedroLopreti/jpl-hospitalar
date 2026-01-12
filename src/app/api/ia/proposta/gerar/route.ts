import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/ia/proposta/gerar
 * Gera proposta mockada
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

        // Criar proposta mockada
        const { data: proposta, error } = await supabase
            .from('PropostaGerada')
            .insert({
                edital_id: editalId,
                conteudo_tecnico: `[PROPOSTA TÉCNICA MOCKADA]

Este é um conteúdo de exemplo gerado automaticamente.

Futuramente, o agente de IA irá:
- Analisar os requisitos do edital
- Selecionar produtos adequados
- Gerar descrição técnica completa

Produto selecionado: [A SER DETERMINADO PELA IA]
Especificações: [A SER GERADO PELA IA]`,
                conteudo_comercial: `[PROPOSTA COMERCIAL MOCKADA]

Este é um conteúdo de exemplo gerado automaticamente.

Futuramente, o agente de IA irá:
- Calcular custos
- Aplicar impostos e frete
- Definir margem
- Gerar valor final

Valor estimado: R$ 0,00 (a ser calculado pela IA)`,
                status: 'DRAFT',
            })
            .select()
            .single()

        if (error) throw error

        // Atualizar status do edital
        await supabase
            .from('Edital')
            .update({ status: 'PROPOSAL_GENERATED' })
            .eq('id', editalId)

        // Log
        await supabase
            .from('LogProcessamento')
            .insert({
                edital_id: editalId,
                etapa: 'PROPOSAL_GENERATION',
                mensagem: 'Proposta gerada (mockup)',
            })

        return NextResponse.json({
            success: true,
            propostaId: proposta.id,
        })
    } catch (error) {
        console.error('Erro ao gerar proposta:', error)
        return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
    }
}
