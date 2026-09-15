import { DB, uid, saveTable, ongById } from '../db.js';
import { currentUser } from '../state.js';
import { statusLabel } from '../utils.js';

export function setupProjetos(afterChange) {
  document.getElementById('projetoFormHolder').addEventListener('submit', async (e) => {
    if (e.target.id !== 'formProjeto') return;
    e.preventDefault();

    const ong = document.getElementById('pOng').value;
    const titulo = document.getElementById('pTitulo').value.trim();
    const descricao = document.getElementById('pDesc').value.trim();

    DB.projetos.push({ id: uid('P'), ong, titulo, descricao });
    await saveTable('projetos');
    afterChange();
  });

  document.getElementById('projetoList').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="candidatar"]');
    if (!btn) return;
    const usuario = currentUser();
    if (!usuario) return;

    DB.voluntariados.push({ usuario: usuario.id, projeto: btn.dataset.projeto, status: 'pendente' });
    await saveTable('voluntariados');
    afterChange();
  });
}

export function renderProjetos() {
  renderProjetoForm();
  renderProjetoList();
}

function renderProjetoForm() {
  const holder = document.getElementById('projetoFormHolder');
  const usuario = currentUser();
  const minhasOngsAdmin = usuario
    ? DB.membros.filter((m) => m.usuario === usuario.id && m.adm_ong).map((m) => ongById(m.ong)).filter(Boolean)
    : [];

  if (!usuario || minhasOngsAdmin.length === 0) {
    holder.innerHTML = `<div class="notice">Somente administradores de uma ONG podem cadastrar projetos. ${
      !usuario ? 'Entre com sua conta.' : 'Cadastre uma ONG ou peça para ser administrador de uma.'
    }</div>`;
    return;
  }

  holder.innerHTML = `
    <form class="panel" id="formProjeto">
      <h3>Cadastrar novo projeto</h3>
      <label>ONG responsável</label>
      <select id="pOng">${minhasOngsAdmin.map((o) => `<option value="${o.id}">${o.nome || o.cnpj}</option>`).join('')}</select>
      <label>Título</label><input type="text" id="pTitulo" required>
      <label>Descrição</label><textarea id="pDesc" required></textarea>
      <button class="btn" type="submit">Cadastrar projeto</button>
    </form>`;
}

function renderProjetoList() {
  const list = document.getElementById('projetoList');
  const usuario = currentUser();

  if (DB.projetos.length === 0) {
    list.innerHTML = `<p class="empty">Nenhum projeto cadastrado ainda.</p>`;
    return;
  }

  list.innerHTML = DB.projetos
    .map((projeto) => {
      const ong = ongById(projeto.ong);
      const meuVoluntariado = usuario
        ? DB.voluntariados.find((v) => v.usuario === usuario.id && v.projeto === projeto.id)
        : null;

      return `<div class="card">
        <h3>${projeto.titulo}</h3>
        <p class="meta">ONG: ${ong ? (ong.nome || ong.cnpj) : '?'}</p>
        <p class="meta">id_projeto: ${projeto.id}</p>
        <p>${projeto.descricao}</p>
        ${
          usuario
            ? meuVoluntariado
              ? `<span class="stamp-badge st-${meuVoluntariado.status}">${statusLabel(meuVoluntariado.status)}</span>`
              : `<button class="btn small" data-action="candidatar" data-projeto="${projeto.id}">Quero ser voluntário(a)</button>`
            : '<p class="meta ext-note">Entre para se candidatar.</p>'
        }
      </div>`;
    })
    .join('');
}
