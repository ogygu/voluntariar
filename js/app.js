import { loadAll } from './db.js';
import { currentUser, logout } from './state.js';

import { setupCadastro } from './views/cadastro.js';
import { setupEntrar } from './views/entrar.js';
import { setupOngs, renderOngs } from './views/ongs.js';
import { setupProjetos, renderProjetos } from './views/projetos.js';
import { setupMeuVoluntariado, renderMeuVoluntariado } from './views/meuVoluntariado.js';
import { setupPainel, renderPainel } from './views/painel.js';
import { setupBancoDados, renderBancoDados } from './views/bancoDados.js';

function renderSession() {
  const box = document.getElementById('sessionBox');
  const usuario = currentUser();

  if (usuario) {
    box.innerHTML = `Conectado como <strong>${usuario.nome_usuario}</strong> &nbsp;<button id="btnSair">Sair</button>`;
    document.getElementById('btnSair').onclick = () => {
      logout();
      renderAll();
      goTab('inicio');
    };
  } else {
    box.innerHTML = `Você não está conectado &nbsp;<button id="btnIrEntrar">Entrar</button>`;
    document.getElementById('btnIrEntrar').onclick = () => goTab('entrar');
  }
}

function renderAll() {
  renderSession();
  renderOngs();
  renderProjetos();
  renderMeuVoluntariado();
  renderPainel();
  renderBancoDados();
}

function goTab(tab) {
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('section.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + tab));
  renderAll();
}

document.getElementById('tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-tab]');
  if (!btn) return;
  goTab(btn.dataset.tab);
});

(async function start() {
  await loadAll();

  setupCadastro();
  setupEntrar(() => {
    renderAll();
    goTab('ongs');
  });
  setupOngs(renderAll);
  setupProjetos(renderAll);
  setupMeuVoluntariado(renderAll);
  setupPainel(renderAll);
  setupBancoDados(() => {
    renderAll();
    goTab('inicio');
  });

  renderAll();
})();
