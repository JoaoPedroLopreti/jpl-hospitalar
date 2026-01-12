// Types for Product Catalog

export type Categoria = {
    nome: string
    slug: string
    descricao: string
    totalProdutos: number
}

export type Produto = {
    id: string
    nome: string
    categoria: string
    descricaoCurta: string | null
    especificacoes: string[]
    aplicacao: string | null
    observacoes: string | null
    imagemUrl: string | null
    pdfUrl: string | null
    custoBase: number
    ativo: boolean
    createdAt: Date
    updatedAt: Date
}

export type ProdutoListagem = Pick<
    Produto,
    'id' | 'nome' | 'categoria' | 'descricaoCurta' | 'imagemUrl'
>

export type CategoriaInfo = {
    nome: string
    slug: string
    count: number
}
