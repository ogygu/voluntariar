# Voluntariar

Protótipo de front-end da plataforma Voluntariar, que conecta pessoas
interessadas em voluntariado a ONGs com projetos disponíveis. Implementa as
5 entidades do modelo lógico do minimundo: `Cadastro_Usuario`,
`Cadastro_ONG`, `Membro`, `Projetos` e `Voluntariado`.

## Estrutura do projeto

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
