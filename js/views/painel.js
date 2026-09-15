import { DB, saveTable, ongById, usuarioById, membrosDaOng } from '../db.js';
import { currentUser } from '../state.js';
import { statusLabel } from '../utils.js';

export function setupPainel(afterChange) {
  document.getElementById('painelHolder').addEventListener('click', async (e) => {
    const admBtn = e.target.closest('button[data-action="alternar-admin"]');
    if (admBtn) {
      const membro = DB.membros.find((m) => m.usuario === admBtn.dataset.usuario && m.ong === admBtn.dataset.ong);
      if (membro) {
        membro.adm_ong = !membro.adm_ong;
        await saveTable('membros');
        afterChange();
      }
      return;
    }

    const decideBtn = e.target.closest('button[data-action="decidir"]');
    if (decideBtn) {
      const registro = DB.voluntariados.find(
        (v) => v.usuario === decideBtn.dataset.usuario && v.projeto === decideBtn.dataset.projeto
      );
      if (registro) {
        registro.status = decideBtn.dataset.status;
        await saveTable('voluntariados');
        afterChange();
      }
    }
  });
}

export function renderPainel() {
  const holder = document.getElementById('painelHolder');
  const usuario = currentUser();

  if (!usuario) {
    holder.innerHTML = `<div class="notice">Entre com sua conta.</div>`;
    return;
  }

  const ongsAdmin = DB.membros
    .filter((m) => m.usuario === usuario.id && m.adm_ong)
    .map((m) => ongById(m.ong))
    .filter(Boolean);

  if (ongsAdmin.length === 0) {
    holder.innerHTML = `<div class="notice">Você não é administrador(a) de nenhuma ONG.</div>`;
    return;
  }

  holder.innerHTML = ongsAdmin
    .map((ong) => {
      const projetos = DB.projetos.filter((p) => p.ong === ong.id);
      const membros = membrosDaOng(ong.id);

      const membrosHtml =
        membros
          .map((m) => {
            const usr = usuarioById(m.usuario);
            return `<div class="meta">• ${usr ? usr.nome_usuario : '?'} ${m.adm_ong ? '<span class="tag">admin</span>' : ''}
              ${
                usr && usr.id !== usuario.id
                  ? `<button class="btn small secondary" data-action="alternar-admin" data-usuario="${m.usuario}" data-ong="${ong.id}">${
                      m.adm_ong ? 'Remover admin' : 'Tornar admin'
                    }</button>`
                  : ''
              }
            </div>`;
          })
          .join('') || '<p class="empty">Sem membros.</p>';

      const projetosHtml =
        projetos
          .map((projeto) => {
            const pedidos = DB.voluntariados.filter((v) => v.projeto === projeto.id);
            const pedidosHtml =
              pedidos
                .map((v) => {
                  const usr = usuarioById(v.usuario);
                  return `<div class="meta">• ${usr ? usr.nome_usuario : '?'} — <span class="stamp-badge st-${v.status}">${statusLabel(v.status)}</span>
                    ${
                      v.status === 'pendente'
                        ? `<button class="btn small" data-action="decidir" data-usuario="${v.usuario}" data-projeto="${v.projeto}" data-status="aprovado">Aprovar</button>
                           <button class="btn small danger" data-action="decidir" data-usuario="${v.usuario}" data-projeto="${v.projeto}" data-status="recusado">Recusar</button>`
                        : ''
                    }
                  </div>`;
                })
                .join('') || '<p class="empty">Nenhum pedido de voluntariado.</p>';
            return `<div class="card"><h3>${projeto.titulo}</h3>${pedidosHtml}</div>`;
          })
          .join('') || '<p class="empty">Esta ONG ainda não tem projetos.</p>';

      return `<div class="section-gap">
        <h3>${ong.nome || ong.cnpj}</h3>
        <p class="meta ext-note">Membros</p>
        ${membrosHtml}
        <p class="meta ext-note section-gap">Projetos e pedidos de voluntariado</p>
        <div class="grid">${projetosHtml}</div>
      </div>`;
    })
    .join('<hr style="border:none;border-top:1px dashed var(--line); margin:28px 0;">');
}
