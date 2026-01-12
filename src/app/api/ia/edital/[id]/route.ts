import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/ia/edital/[id]
 * Retorna todos os dados relacionados ao edital
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
        }

        const { id: editalId } = await params

        // Buscar edital com todos os relacionamentos
        const { data: edital } = await supabase
            .from('Edital')
            .select(`
        *,
        requisitos:RequisitosExtraidos(*),
        analisesProduto:AnaliseProduto(*, produto:ProdutoCatalogo(*)),
        precificacao:Precificacao(*),
        proposta:PropostaGerada(*),
        logs:LogProcessamento(*)
      `)
            .eq('id', editalId)
            .single()

        if (!edital) {
            return NextResponse.json({ success: false, error: 'Edital não encontrado' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: {
                edital: {
                    id: edital.id,
                    nome: edital.nome,
                    arquivoUrl: edital.arquivo_url,
                    status: edital.status,
                    createdBy: edital.created_by,
                    createdAt: edital.created_at,
                    updatedAt: edital.updated_at,
                },
                requisitos: edital.requisitos || [],
                analises: edital.analisesProduto || [],
                precificacao: edital.precificacao?.[0] || null,
                proposta: edital.proposta?.[0] || null,
                logs: edital.logs || [],
            },
        })
    } catch (error) {
        console.error('Erro ao buscar edital:', error)
        return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
    }
}
