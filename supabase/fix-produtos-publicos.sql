-- ============================================================================
-- FIX: Permitir acesso público ao catálogo de produtos
-- ============================================================================

-- 1. Adicionar política para acesso público (anônimo)
DROP POLICY IF EXISTS "Acesso público para visualizar produtos" ON "ProdutoCatalogo";

CREATE POLICY "Acesso público para visualizar produtos"
  ON "ProdutoCatalogo" FOR SELECT
  USING (ativo = true);

-- Esta política permite que QUALQUER pessoa (autenticada ou não) veja produtos ativos
-- Remove a restrição TO authenticated da política anterior

-- 2. Inserir produtos do catálogo JPL/KTK
INSERT INTO "ProdutoCatalogo" (
  nome,
  categoria,
  descricao_curta,
  especificacoes,
  aplicacao,
  observacoes,
  custo_base,
  imagem_url,
  pdf_url,
  ativo
) VALUES
-- Aparelhos de Anestesia
(
  'SAT 700',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia de última geração com tela touchscreen de 15" e rotâmetro digital',
  '["Tela de 15\" Touchscreen (3 gráficos e 2 Loops simultâneos)", "Leitura digital do Rotâmetro monitorizada na Tela do Ventilador", "Rotâmetro Digital (3 gases)", "Filtro Aquecido com By Pass", "Suporte para monitores opcionais", "Suporte para bomba de infusão (opcional)"]'::jsonb,
  'Utilizado em centros cirúrgicos de alta complexidade, hospitais de grande porte e instituições que demandam tecnologia de ponta para procedimentos anestésicos variados.',
  'Modelo top de linha com máxima tecnologia e recursos avançados de monitoramento.',
  0,
  '/produtos/sat-700.jpg',
  '/produtos/pdfs/sat-700.pdf',
  true
),
(
  'SAT 600 PLUS',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia com tela touchscreen de 10" e rotâmetro digital',
  '["Tela de 10\" Touchscreen", "Rotâmetro Digital (3 gases)", "Filtro Aquecido com By Pass"]'::jsonb,
  'Ideal para centros cirúrgicos modernos que necessitam de precisão digital no controle de gases anestésicos.',
  NULL,
  0,
  '/produtos/sat-600-plus.jpg',
  '/produtos/pdfs/sat-600-plus.pdf',
  true
),
(
  'SAT 600',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia com tela touchscreen de 10" e rotâmetro mecânico',
  '["Tela de 10\" Touchscreen", "Rotâmetro Mecânico (3 gases)", "Filtro Aquecido com By Pass", "Suporte para monitor e braço articulado"]'::jsonb,
  'Versátil para diversas aplicações em ambientes hospitalares, combinando tecnologia moderna com confiabilidade mecânica.',
  NULL,
  0,
  '/produtos/sat-600.jpg',
  '/produtos/pdfs/sat-600.pdf',
  true
),
(
  'SAT 500 PLUS',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia com tela touchscreen e filtro Siva com sensor único',
  '["Tela de 10\" Touchscreen", "Rotâmetro Mecânico (3 gases)", "Filtro Siva com Sensor único", "Suporte para monitores e braço articulado"]'::jsonb,
  'Indicado para hospitais que buscam equilíbrio entre custo-benefício e tecnologia avançada.',
  NULL,
  0,
  '/produtos/sat-500-plus.jpg',
  '/produtos/pdfs/sat-500-plus.pdf',
  true
),
(
  'SAT 400',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia compacto com tela de 5.7" e carro móvel',
  '["Rotâmetro Mecânico (2 gases) O2 + Ar Comprimido (Opcional)", "Rotâmetro Mecânico (2 gases) O2 + N2O (Opcional)", "Tela 5.7\"", "Filtro Siva Valvular", "Suporte para 1 Vaporizador Calibrado", "Carro móvel com 1 gaveta"]'::jsonb,
  'Solução prática e econômica para clínicas e hospitais de pequeno e médio porte.',
  NULL,
  0,
  '/produtos/sat-400.jpg',
  '/produtos/pdfs/sat-400.pdf',
  true
),
(
  'SAT MRI PLUS',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia para salas de ressonância magnética com rotâmetro digital',
  '["Para salas MRI (1,5T / 3T)", "Campo magnético até 40 mTesla (400 gauss)", "Tela de 10\" Touchscreen", "Rotâmetro Digital (3 gases)", "Filtro Aquecido com By Pass", "Suporte para 2 Vaporizadores MRI"]'::jsonb,
  'Exclusivo para uso em ambientes de ressonância magnética, garantindo segurança e compatibilidade total.',
  'Totalmente compatível com campos magnéticos de alta intensidade.',
  0,
  '/produtos/sat-mri-plus.jpg',
  '/produtos/pdfs/sat-mri-plus.pdf',
  true
),
(
  'SAT MRI',
  'Aparelhos de Anestesia',
  'Aparelho de anestesia para salas de ressonância magnética com rotâmetro mecânico',
  '["Para salas MRI (1,5T / 3T)", "Campo magnético até 40 mTesla (400 gauss)", "Tela de 10\" Touchscreen", "Rotâmetro Mecânico (3 gases)", "Filtro Aquecido com By Pass", "Suporte para 2 Vaporizadores MRI"]'::jsonb,
  'Solução confiável para procedimentos anestésicos em ambientes de ressonância magnética.',
  'Versão com rotâmetro mecânico para maior durabilidade em ambientes MRI.',
  0,
  '/produtos/sat-mri.jpg',
  '/produtos/pdfs/sat-mri.pdf',
  true
),
-- Ventilador Pulmonar
(
  'MICROTAK TOTAL',
  'Ventilador Pulmonar',
  'Ventilador eletrônico microprocessado para transporte e uso hospitalar',
  '["Ventilador eletrônico microprocessado", "Transporte intra e extra hospitalar", "Adulto, infantil e neonatal", "Modos: VCV, PLV, SIMV, CPAP, Manual e Espontânea", "Fixação para ambulâncias e resgate", "Opcional com carro móvel"]'::jsonb,
  'Ideal para UTIs, transporte de pacientes críticos, ambulâncias e equipes de resgate. Versatilidade para atender todas as faixas etárias.',
  'Múltiplos modos ventilatórios garantem adaptabilidade a diferentes necessidades clínicas.',
  0,
  '/produtos/microtak-total.jpg',
  '/produtos/pdfs/microtak-total.pdf',
  true
),
-- Aspiradores Cirúrgicos
(
  'ACT 200',
  'Aspiradores Cirúrgicos',
  'Aspirador cirúrgico de alta performance com sistema Auto-Stop',
  '["Motor de alta performance, sem óleo", "1 Frasco autoclavável de 5L", "Sistema Auto-Stop", "Frasco coletor de 400ml", "Filtro Hidrocheck"]'::jsonb,
  'Aplicado em procedimentos cirúrgicos gerais para aspiração de fluidos e secreções.',
  NULL,
  0,
  '/produtos/act-200.jpg',
  '/produtos/pdfs/act-200.pdf',
  true
),
(
  'ACT 300',
  'Aspiradores Cirúrgicos',
  'Aspirador cirúrgico ideal para lipoaspiração com 2 frascos de 5L',
  '["Ideal para lipoaspiração", "2 Frascos de 5L", "Sistema Auto-Stop", "Frasco coletor de 400ml", "Filtro Hidrocheck", "Funcionamento silencioso"]'::jsonb,
  'Específico para procedimentos de lipoaspiração e cirurgias plásticas que demandam maior capacidade de aspiração.',
  'Funcionamento silencioso proporciona maior conforto no ambiente cirúrgico.',
  0,
  '/produtos/act-300.jpg',
  '/produtos/pdfs/act-300.pdf',
  true
),
-- Linha Veterinária
(
  'KT 15',
  'Linha Veterinária',
  'Aparelho de anestesia veterinária completo e versátil',
  '["Anestesia veterinária", "Fluxômetro com ajuste de O2", "Filtro valvular inspiratório e expiratório", "Controle de PEEP e escape", "Canister para cal sodada", "Traqueia e balão 2L", "Botão de O2 direto", "Suporte para vaporizador (opcional)"]'::jsonb,
  'Desenvolvido especialmente para procedimentos veterinários em clínicas e hospitais veterinários.',
  NULL,
  0,
  '/produtos/kt-15.jpg',
  '/produtos/pdfs/kt-15.pdf',
  true
)
ON CONFLICT (nome) DO UPDATE SET
  categoria = EXCLUDED.categoria,
  descricao_curta = EXCLUDED.descricao_curta,
  especificacoes = EXCLUDED.especificacoes,
  aplicacao = EXCLUDED.aplicacao,
  observacoes = EXCLUDED.observacoes,
  custo_base = EXCLUDED.custo_base,
  imagem_url = EXCLUDED.imagem_url,
  pdf_url = EXCLUDED.pdf_url,
  ativo = EXCLUDED.ativo;

-- Verificar quantos produtos foram inseridos
SELECT 'Produtos inseridos: ' || COUNT(*) as resultado FROM "ProdutoCatalogo" WHERE ativo = true;
SELECT 'Categorias disponíveis: ' || COUNT(DISTINCT categoria) as resultado FROM "ProdutoCatalogo" WHERE ativo = true;
