# Site da Feira de Profissões — Engenharia de Software

> **Código que transforma ideias em soluções.**

Site multipágina em **HTML5, CSS3 e JavaScript puro**, sem frameworks, backend ou banco de dados.
Identidade visual minimalista e serena: fundo marfim, verde sálvia, azul petróleo suave e grafite;
tipografia Instrument Serif (títulos), Figtree (texto) e JetBrains Mono (detalhes técnicos).

## Como executar

- **Mais simples:** abra `index.html` no navegador (dois cliques).
- **Servidor local** (recomendado, simula a hospedagem): na pasta do projeto, rode
  `python3 -m http.server 8000` e acesse `http://localhost:8000`.

Todos os caminhos são relativos, então o site funciona em qualquer hospedagem estática (GitHub Pages, Netlify etc.).
Sem internet, as fontes do Google não carregam e o site usa fontes de reserva.

## Estrutura

```text
engenharia-software/
├── index.html                 ← página inicial (apresenta e direciona)
├── pages/
│   ├── profissao.html         ← o que é, programar × engenharia, aplicações
│   ├── historia.html          ← linha do tempo interativa (10 marcos)
│   ├── areas.html             ← 10 áreas com filtro por foco
│   ├── desenvolvimento.html   ← ciclo de vida em 8 etapas + exemplo interativo
│   ├── formacao.html          ← graduação, disciplinas, estágios, onde estudar
│   ├── mercado.html           ← salários de contratação e dados do setor
│   ├── stand.html             ← galeria preparada para registros reais
│   └── creditos.html          ← equipe (a preencher) e referências
├── css/
│   ├── style.css              ← variáveis (cores, fontes), base, cabeçalho e rodapé
│   ├── components.css         ← botões, notas, gráficos, tabelas, galeria
│   └── pages.css              ← estilos de cada página
├── js/
│   ├── navigation.js          ← menu móvel e cabeçalho
│   ├── main.js                ← animações de entrada e "voltar ao topo"
│   └── interactions.js        ← linha do tempo, filtro, etapas, demo, testes, lightbox
├── assets/{images, icons, videos}
└── README.md
```

### Cabeçalho e rodapé
Sem framework, o cabeçalho e o rodapé estão repetidos nas 9 páginas (idênticos). Se mudar um link do menu,
mude nas 9. A página atual já vem marcada no HTML com `aria-current="page"`.

## O que falta preencher (nada foi inventado)

1. **Créditos** (`pages/creditos.html`): troque o texto de cada `<dd class="fill">[...]</dd>` e remova a classe `fill`.
2. **Stand** (`pages/stand.html`): depois da feira, copie fotos para `assets/images/` e vídeos para `assets/videos/`,
   e substitua cada `<div class="slot__empty">` pelo modelo que está no comentário da página. A ampliação das fotos
   (lightbox) já funciona e fecha com **Esc**. Troque também o parágrafo do relato da equipe.
   Use somente registros reais da equipe.

## O exemplo “Monitoria Fácil”

Na página *Como um software é construído*, o aplicativo de monitoria é **fictício e didático** (isso está escrito na página).
As partes interativas são reais: o formulário usa a mesma regra de agendamento mostrada no código, os 6 testes
automatizados executam essa regra no navegador, a opção “simular um erro” faz o teste 5 falhar, e a esteira de
publicação fica bloqueada até todos os testes passarem.

## Como atualizar os dados do mercado

Os números estão no próprio HTML, ao lado da fonte. As barras usam variáveis CSS inline:

| Gráfico | Escala (100%) | Fórmula |
| --- | --- | --- |
| Brasil × Paraná | R$ 12.000 | `--from` = início ÷ 12.000 · `--width` = (fim − início) ÷ 12.000 · `--at` = mediana ÷ 12.000 |
| Mediana por idade | R$ 12.000 | `--w` = valor ÷ 12.000 |
| Profissionais de TI | 100% | `--w` = percentual |
| Crescimento do mercado | 20% | `--w` = crescimento ÷ 20 |

Multiplique por 100 para obter a porcentagem. Os rótulos do eixo ficam em `<div class="axis">`.

## Fontes

Lista completa, com links, em `pages/creditos.html`. Principais: Recoloca (Novo CAGED/MTE), Brasscom (Relatório
Setorial 2025), ABES/IDC, MEC (Resolução CNE/CES nº 5/2016), relatório e artigo de Brian Randell sobre a
conferência da OTAN de 1968, ACM (Dijkstra), CERN e páginas oficiais da UTFPR, PUCPR e UNICURITIBA.
Conteúdo conferido em 11/11/2026; antes de apresentar, abra os links mais uma vez.

## Acessibilidade e desempenho

HTML semântico, um `h1` por página, hierarquia de títulos sem saltos, contraste AA conferido, foco visível,
link “Pular para o conteúdo”, menu móvel com Esc, abas acessíveis por teclado, `prefers-reduced-motion` respeitado
e conteúdo legível mesmo sem JavaScript. Ilustrações em SVG leve, sem imagens pesadas.
