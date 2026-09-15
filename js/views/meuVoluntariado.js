import { DB, saveTable, projetoById, ongById } from '../db.js';
import { currentUser } from '../state.js';
import { statusLabel } from '../utils.js';

export function setupMeuVoluntariado(afterChange) {
  document.getElementById('meuVolList').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="cancelar"]');
    if (!btn) return;

    const registro = DB.voluntariados.find(
      (v) => v.usuario === btn.dataset.usuario && v.projeto === btn.dataset.projeto
    );
    if (registro) {
      registro.status = 'cancelado';
      await saveTable('voluntariados');
      afterChange();
    }
  });
}

export function renderMeuVoluntariado() {
  const holder = document.getElementById('meuVolList');
  const usuario = currentUser();

  if (!usuario) {
    holder.innerHTML = `<div class="notice">Entre com sua conta para ver seus voluntariados.</div>`;
    return;
  }

  const meus = DB.voluntariados.filter((v) => v.usuario === usuario.id);
  if (meus.length === 0) {
    holder.innerHTML = `<p class="empty">Você ainda não se candidatou a nenhum projeto. Veja a aba Projetos.</p>`;
    return;
  }

  holder.innerHTML =
    `<div class="grid">` +
    meus
      .map((v) => {
        const projeto = projetoById(v.projeto);
        const ong = projeto ? ongById(projeto.ong) : null;
        const podeCancelar = v.status === 'pendente' || v.status === 'aprovado';

        return `<div class="card">
          <h3>${projeto ? projeto.titulo : '(projeto removido)'}</h3>
          <p class="meta">ONG: ${ong ? (ong.nome || ong.cnpj) : '?'}</p>
          <span class="stamp-badge st-${v.status}">${statusLabel(v.status)}</span>
          ${
            podeCancelar
              ? `<div><button class="btn small danger" data-action="cancelar" data-usuario="${v.usuario}" data-projeto="${v.projeto}">Cancelar</button></div>`
              : ''
          }
        </div>`;
      })
      .join('') +
    `</div>`;
}
