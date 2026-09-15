# Voluntariar - Conectando Jovens, ONGs e Instituições de Ensino

## 🎯 Propósito do Sistema

O sistema tem como propósito conectar jovens, ONGs e instituições de ensino por meio de uma plataforma digital acessível e intuitiva, facilitando o acesso à informação sobre projetos sociais, oportunidades de voluntariado e estágios, reduzindo a desigualdade informacional e promovendo a inclusão social e o desenvolvimento profissional, ao mesmo tempo em que fortalece a colaboração entre a comunidade e as organizações, com processos simples, diretos e com maior praticidade possível.

## 📌 Contexto e Problema

O sistema atua em um contexto no qual jovens têm dificuldade de encontrar oportunidades de se voluntariar ou encontrar vagas de estágio e ONGs têm dificuldade de divulgá-las, gerando uma desconexão que complica a solução dos problemas dos supracitados. A plataforma proposta centraliza essas informações, permitindo cadastro de usuários, divulgação de projetos e vagas, além de candidaturas, simplificando processos e facilitando a conexão entre as partes, com o objetivo de ampliar oportunidades e gerar impacto social positivo.

## 💻 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da aplicação
- **CSS3**: Estilização com variáveis CSS, Grid Layout, Flexbox e design responsivo
- **JavaScript (ES6+)**: Lógica da aplicação com módulos ES6 (`import`/`export`)
- **localStorage**: Persistência de dados no navegador do usuário
- **Node.js**: Servidor estático para desenvolvimento local (via `npx serve`)
- **Arquitetura SPA**: Single Page Application com navegação dinâmica entre seções

## 🏗️ Estrutura do Projeto

```
voluntariar/
├── index.html              # estrutura das páginas (abas/seções)
├── css/
│   └── style.css            # todo o estilo visual
├── js/
│   ├── app.js                # ponto de entrada: navegação entre abas
│   ├── db.js                  # "tabelas" em memória + load/save/reset
│   ├── storage.js             # camada de persistência (hoje: localStorage)
│   ├── state.js                # sessão (usuário logado)
│   ├── utils.js                 # helpers pequenos (rótulo de status)
│   └── views/
│       ├── cadastro.js           # cadastro de usuário
│       ├── entrar.js              # login
│       ├── ongs.js                 # cadastro de ONG e vínculo de membros
│       ├── projetos.js              # cadastro e listagem de projetos
│       ├── meuVoluntariado.js        # voluntariados do usuário logado
│       ├── painel.js                  # painel administrativo da ONG
│       └── bancoDados.js               # visão bruta das 5 tabelas
├── package.json
└── README.md
```

Cada view tem duas partes:
- `setupX(...)` — roda **uma vez**, no carregamento da página, e anexa os
  listeners de clique/submit (usando delegação de evento, já que o HTML
  interno é recriado a cada `render`).
- `renderX()` — roda **toda vez que o estado muda**, e só redesenha o HTML
  daquela seção a partir do que está em `DB`.

`app.js` chama todos os `setupX` uma vez no início e depois um `renderAll()`
sempre que algo muda (login, cadastro, aprovação de voluntariado, etc.).

## Como rodar no VS Code

Como o app usa módulos ES (`import`/`export`), **não dá para abrir o
`index.html` direto no navegador** (`file://`) — os navegadores bloqueiam
`import` por CORS nesse esquema. É preciso servir os arquivos por HTTP.
Duas opções fáceis:

**Opção 1 — extensão Live Server**
1. Instale a extensão "Live Server" no VS Code.
2. Clique com o botão direito em `index.html` → "Open with Live Server".

**Opção 2 — terminal**
```bash
npm start
```
Isso sobe um servidor estático em `http://localhost:5500` usando `npx serve`
(não precisa instalar nada previamente, só ter Node.js).

## Onde os dados ficam

Os dados são salvos no `localStorage` do navegador (por isso só existem
naquele navegador/máquina — diferente de um banco de dados compartilhado de
verdade). Para trocar por uma API real depois, basta reescrever
`js/storage.js`; o resto do código não precisa mudar, porque só conhece
`getItem`/`setItem`/`removeItems`.

Use o botão **"Reiniciar banco de dados"** na aba "Banco de dados" para
limpar tudo e recomeçar do zero.

## Extensões ao minimundo original

Três campos foram adicionados só por usabilidade, e estão marcados com `*`
na aba "Banco de dados":
- `nome` em `Cadastro_ONG`
- `titulo` e `descricao` em `Projetos`

Sem eles não dava para identificar visualmente as organizações e as
oportunidades na tela.
