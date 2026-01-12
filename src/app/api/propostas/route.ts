import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/app/actions/auth"

export async function POST(request: NextRequest) {
    try {
        const user = await getUser()

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const body = await request.json()
        const { title, userId } = body

        if (!title || !userId) {
            return NextResponse.json(
                { error: "Dados incompletos" },
                { status: 400 }
            )
        }

        // Verificar se o usuário está criando proposta para si mesmo
        if (userId !== user.id) {
            return NextResponse.json(
                { error: "Permissão negada" },
                { status: 403 }
            )
        }

        const supabase = await createClient()
        const { data: proposal, error: createError } = await supabase
            .from('Proposal')
            .insert({
                title,
                userId,
            })
            .select()
            .single()

        if (createError) {
            console.error("Error creating proposal:", createError)
            return NextResponse.json(
                { error: "Erro ao criar proposta" },
                { status: 500 }
            )
        }

        return NextResponse.json(proposal, { status: 201 })
    } catch (error) {
        console.error("Error creating proposal:", error)
        return NextResponse.json(
            { error: "Erro ao criar proposta" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await getUser()

        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
        }

        const supabase = await createClient()
        const { data: proposals, error: fetchError } = await supabase
            .from('Proposal')
            .select('*')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })

        if (fetchError) {
            console.error("Error fetching proposals:", fetchError)
            return NextResponse.json(
                { error: "Erro ao buscar propostas" },
                { status: 500 }
            )
        }

        return NextResponse.json(proposals)
    } catch (error) {
        console.error("Error fetching proposals:", error)
        return NextResponse.json(
            { error: "Erro ao buscar propostas" },
            { status: 500 }
        )
    }
}
