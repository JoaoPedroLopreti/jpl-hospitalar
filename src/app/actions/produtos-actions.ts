'use server'

import { createClient } from '@/lib/supabase/server'
import type { Produto, CategoriaInfo } from '@/lib/types/produtos-types'

/**
 * Get all unique categories with product counts
 */
export async function getCategorias(): Promise<CategoriaInfo[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('ProdutoCatalogo')
        .select('categoria')
        .eq('ativo', true)

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }

    if (!data || data.length === 0) {
        return []
    }

    // Group by category and count
    const categoriesMap = new Map<string, number>()

    data.forEach((item) => {
        const count = categoriesMap.get(item.categoria) || 0
        categoriesMap.set(item.categoria, count + 1)
    })

    // Convert to array with slugs
    const categories: CategoriaInfo[] = Array.from(categoriesMap.entries()).map(
        ([nome, count]) => ({
            nome,
            slug: nome
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-'),
            count,
        })
    )

    return categories
}

/**
 * Get products by category
 */
export async function getProdutosPorCategoria(
    categoria: string
): Promise<Produto[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('ProdutoCatalogo')
        .select('*')
        .eq('categoria', categoria)
        .eq('ativo', true)
        .order('nome', { ascending: true })

    if (error) {
        console.error('Error fetching products by category:', error)
        return []
    }

    return data.map((item) => ({
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        descricaoCurta: item.descricao_curta,
        especificacoes: Array.isArray(item.especificacoes)
            ? item.especificacoes
            : [],
        aplicacao: item.aplicacao,
        observacoes: item.observacoes,
        custoBase: Number(item.custo_base),
        imagemUrl: item.imagem_url,
        pdfUrl: item.pdf_url,
        ativo: item.ativo,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
    }))
}

/**
 * Get a single product by ID
 */
export async function getProdutoById(id: string): Promise<Produto | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('ProdutoCatalogo')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single()

    if (error || !data) {
        console.error('Error fetching product:', error)
        return null
    }

    return {
        id: data.id,
        nome: data.nome,
        categoria: data.categoria,
        descricaoCurta: data.descricao_curta,
        especificacoes: Array.isArray(data.especificacoes)
            ? data.especificacoes
            : [],
        aplicacao: data.aplicacao,
        observacoes: data.observacoes,
        custoBase: Number(data.custo_base),
        imagemUrl: data.imagem_url,
        pdfUrl: data.pdf_url,
        ativo: data.ativo,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    }
}

/**
 * Get all active products
 */
export async function getAllProdutos(): Promise<Produto[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('ProdutoCatalogo')
        .select('*')
        .eq('ativo', true)
        .order('categoria', { ascending: true })
        .order('nome', { ascending: true })

    if (error) {
        console.error('Error fetching all products:', error)
        return []
    }

    return data.map((item) => ({
        id: item.id,
        nome: item.nome,
        categoria: item.categoria,
        descricaoCurta: item.descricao_curta,
        especificacoes: Array.isArray(item.especificacoes)
            ? item.especificacoes
            : [],
        aplicacao: item.aplicacao,
        observacoes: item.observacoes,
        custoBase: Number(item.custo_base),
        imagemUrl: item.imagem_url,
        pdfUrl: item.pdf_url,
        ativo: item.ativo,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
    }))
}

/**
 * Get category name by slug
 */
export async function getCategoriaBySlug(
    slug: string
): Promise<string | null> {
    const categories = await getCategorias()
    const category = categories.find((cat) => cat.slug === slug)
    return category ? category.nome : null
}
