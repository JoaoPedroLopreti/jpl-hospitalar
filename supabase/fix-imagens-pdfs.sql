-- ============================================================================
-- FIX: Atualizar caminhos de imagens e PDFs para coincidir com arquivos reais
-- ============================================================================

-- Atualizar cada produto com os caminhos corretos das imagens e PDFs
-- Os arquivos estão em: public/produtos/*.jpg e public/produtos/pdfs/*.pdf

UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT 700.jpg', pdf_url = '/produtos/pdfs/Catalogo Sat 700.pdf' WHERE nome = 'SAT 700';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT 600 PLUS.jpg', pdf_url = '/produtos/pdfs/Catalogo 600 Plus.pdf' WHERE nome = 'SAT 600 PLUS';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT 600.jpg', pdf_url = '/produtos/pdfs/Catalogo Sat 600.pdf' WHERE nome = 'SAT 600';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT 500 PLUS.jpg', pdf_url = '/produtos/pdfs/Catalogo Sat 500 Plus.pdf' WHERE nome = 'SAT 500 PLUS';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT 400.jpg', pdf_url = '/produtos/pdfs/Catalogo Sat 400.pdf' WHERE nome = 'SAT 400';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT MRI PLUS.jpg', pdf_url = '/produtos/pdfs/Catalogo Sat Mri Plus.pdf' WHERE nome = 'SAT MRI PLUS';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/SAT MRI.jpg', pdf_url = '/produtos/pdfs/Catalogo Sat Mri.pdf' WHERE nome = 'SAT MRI';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/MICROTAK TOTAL.jpg', pdf_url = '/produtos/pdfs/Microtak Total.pdf' WHERE nome = 'MICROTAK TOTAL';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/ACT 200.jpg', pdf_url = '/produtos/pdfs/Catalogo-ACT-200.pdf' WHERE nome = 'ACT 200';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/ACT 300.jpg', pdf_url = '/produtos/pdfs/Catalogo-ACT-300.pdf' WHERE nome = 'ACT 300';
UPDATE "ProdutoCatalogo" SET imagem_url = '/produtos/KT15.png', pdf_url = '/produtos/pdfs/KT-15.pdf' WHERE nome = 'KT 15';

-- Verificar se as atualizações foram aplicadas
SELECT nome, imagem_url, pdf_url FROM "ProdutoCatalogo" ORDER BY categoria, nome;
