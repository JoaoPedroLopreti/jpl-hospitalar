-- ============================================================================
-- VERIFICAÇÃO E CORREÇÃO FINAL - Caminhos de Imagens e PDFs
-- ============================================================================

-- Primeiro, vamos ver o que está no banco
SELECT nome, imagem_url, pdf_url FROM "ProdutoCatalogo" ORDER BY nome;

-- Agora vamos atualizar TODOS os produtos com os caminhos corretos
-- Os arquivos foram renomeados para: sat-700.jpg, sat-600-plus.jpg, etc.

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-700.jpg', 
  pdf_url = '/produtos/pdfs/sat-700.pdf' 
WHERE nome = 'SAT 700';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-600-plus.jpg', 
  pdf_url = '/produtos/pdfs/sat-600-plus.pdf' 
WHERE nome = 'SAT 600 PLUS';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-600.jpg', 
  pdf_url = '/produtos/pdfs/sat-600.pdf' 
WHERE nome = 'SAT 600';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-500-plus.jpg', 
  pdf_url = '/produtos/pdfs/sat-500-plus.pdf' 
WHERE nome = 'SAT 500 PLUS';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-400.jpg', 
  pdf_url = '/produtos/pdfs/sat-400.pdf' 
WHERE nome = 'SAT 400';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-mri-plus.jpg', 
  pdf_url = '/produtos/pdfs/sat-mri-plus.pdf' 
WHERE nome = 'SAT MRI PLUS';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/sat-mri.jpg', 
  pdf_url = '/produtos/pdfs/sat-mri.pdf' 
WHERE nome = 'SAT MRI';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/microtak-total.jpg', 
  pdf_url = '/produtos/pdfs/microtak-total.pdf' 
WHERE nome = 'MICROTAK TOTAL';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/act-200.jpg', 
  pdf_url = '/produtos/pdfs/act-200.pdf' 
WHERE nome = 'ACT 200';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/act-300.jpg', 
  pdf_url = '/produtos/pdfs/act-300.pdf' 
WHERE nome = 'ACT 300';

UPDATE "ProdutoCatalogo" SET 
  imagem_url = '/produtos/kt-15.png', 
  pdf_url = '/produtos/pdfs/kt-15.pdf' 
WHERE nome = 'KT 15';

-- Verificar se foi atualizado
SELECT nome, imagem_url, pdf_url FROM "ProdutoCatalogo" ORDER BY nome;

-- Contar quantos produtos têm imagens
SELECT COUNT(*) as "Produtos com imagem" FROM "ProdutoCatalogo" WHERE imagem_url IS NOT NULL AND imagem_url != '';
