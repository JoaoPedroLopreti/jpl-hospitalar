import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/ia/proposta/aprovar
 * Aprova ou rejeita proposta (requer permissão)
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
        }

        // Verificar se é ADMIN
        const { data: userData } = await supabase
            .from('User')
            .select('role, name')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'ADMIN') {
            return NextResponse.json({ success: false, error: 'Apenas administradores podem aprovar propostas' }, { status: 403 })
        }

        const body = await request.json()
        const { propostaId, acao, comentarios } = body

        if (!propostaId || !acao) {
            return NextResponse.json({ success: false, error: 'propostaId e acao são obrigatórios' }, { status: 400 })
        }

        if (!['APPROVE', 'REJECT'].includes(acao)) {
            return NextResponse.json({ success: false, error: 'acao inválida' }, { status: 400 })
        }

        // Buscar proposta
        const { data: proposta } = await supabase
            .from('PropostaGerada')
            .select('*, edital:Edital(*)')
            .eq('id', propostaId)
            .single()

        if (!proposta) {
            return NextResponse.json({ success: false, error: 'Proposta não encontrada' }, { status: 404 })
        }

        // Atualizar proposta
        const novoStatus = acao === 'APPROVE' ? 'APPROVED' : 'REJECTED'
        await supabase
            .from('PropostaGerada')
            .update({
                status: novoStatus,
                aprovado_por: user.id,
            })
            .eq('id', propostaId)

        // Atualizar edital
        const editalStatus = acao === 'APPROVE' ? 'APPROVED' : 'REJECTED'
        await supabase
            .from('Edital')
            .update({ status: editalStatus })
            .eq('id', proposta.edital_id)

        // Log
        await supabase
            .from('LogProcessamento')
            .insert({
                edital_id: proposta.edital_id,
                etapa: 'REVIEW',
                mensagem: `Proposta ${acao === 'APPROVE' ? 'aprovada' : 'rejeitada'} por ${userData.name || 'Admin'}${comentarios ? `: ${comentarios}` : ''}`,
            })

        return NextResponse.json({
            success: true,
            novoStatus,
        })
    } catch (error) {
        console.error('Erro ao aprovar proposta:', error)
        return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
    }
}
