# 📸 Guia de Upload de Imagens e PDFs dos Produtos

## 📂 Estrutura de Pastas

Os arquivos devem ser colocados na pasta `public/produtos/` do projeto:

```
c:\Jpl Online\jpl-hospitalar\public\produtos\
  ├── README.md
  ├── pdfs\              ← Catálogos PDF aqui
  └── (imagens aqui)     ← Imagens JPG aqui
```

## 📋 Lista de Arquivos Necessários

### 🖼️ Imagens dos Produtos (formato JPG recomendado)

Coloque diretamente em `public/produtos/`:

**Aparelhos de Anestesia:**
- ✅ `sat-700.jpg`
- ✅ `sat-600-plus.jpg`
- ✅ `sat-600.jpg`
- ✅ `sat-500-plus.jpg`
- ✅ `sat-400.jpg`
- ✅ `sat-mri-plus.jpg`
- ✅ `sat-mri.jpg`

**Ventilador Pulmonar:**
- ✅ `microtak-total.jpg`

**Aspiradores Cirúrgicos:**
- ✅ `act-200.jpg`
- ✅ `act-300.jpg`

**Linha Veterinária:**
- ✅ `kt-15.jpg`

### 📄 Catálogos PDF

Coloque em `public/produtos/pdfs/`:

- ✅ `sat-700.pdf`
- ✅ `sat-600-plus.pdf`
- ✅ `sat-600.pdf`
- ✅ `sat-500-plus.pdf`
- ✅ `sat-400.pdf`
- ✅ `sat-mri-plus.pdf`
- ✅ `sat-mri.pdf`
- ✅ `microtak-total.pdf`
- ✅ `act-200.pdf`
- ✅ `act-300.pdf`
- ✅ `kt-15.pdf`

## 🎯 Como Adicionar os Arquivos

### Método 1: Via Explorador de Arquivos (Recomendado)

1. Abra o Windows Explorer
2. Navegue até: `c:\Jpl Online\jpl-hospitalar\public\produtos\`
3. Copie as imagens JPG diretamente para esta pasta
4. Copie os PDFs para a subpasta `pdfs\`

### Método 2: Via Linha de Comando

```powershell
# Navegue até a pasta do projeto
cd "c:\Jpl Online\jpl-hospitalar\public\produtos"

# Copie suas imagens (exemplo)
Copy-Item "C:\caminho\das\suas\imagens\*.jpg" .

# Copie seus PDFs
Copy-Item "C:\caminho\dos\seus\pdfs\*.pdf" .\pdfs\
```

## ✅ Verificação

Após adicionar os arquivos, verifique se a estrutura está assim:

```
public/produtos/
├── sat-700.jpg
├── sat-600-plus.jpg
├── ... (outras imagens)
├── pdfs/
│   ├── sat-700.pdf
│   ├── sat-600-plus.pdf
│   └── ... (outros PDFs)
└── README.md
```

## 🔄 Atualizações Automáticas

- **NÃO é necessário reiniciar o servidor** - Next.js serve arquivos estáticos automaticamente
- Basta adicionar/substituir os arquivos e **atualizar a página no navegador (F5)**
- As imagens aparecerão imediatamente no catálogo
- Os botões de download de PDF funcionarão automaticamente

## 📐 Recomendações de Formato

### Imagens:
- **Formato:** JPG ou PNG
- **Resolução:** 1200x1200px ou maior (quadrado)
- **Tamanho:** Máximo 500KB por imagem
- **Fundo:** Preferencialmente branco ou transparente

### PDFs:
- **Tamanho:** Máximo 5MB por arquivo
- **Conteúdo:** Catálogo técnico do produto

## ⚠️ Importante

- Os nomes dos arquivos devem ser **exatamente** como indicado acima
- Use **letras minúsculas** e **hifens** (não use espaços ou underscores)
- Enquanto as imagens não estiverem disponíveis, o catálogo mostrará um ícone placeholder (📦)
- O botão de download de PDF só aparecerá quando o arquivo PDF existir

## 🧪 Testando

Após adicionar os arquivos:

1. Acesse: `http://localhost:3000/produtos`
2. Clique em uma categoria
3. Você deve ver as imagens dos produtos
4. Clique em "Ver Detalhes"
5. Você deve ver a imagem grande e o botão "Baixar Catálogo PDF"
