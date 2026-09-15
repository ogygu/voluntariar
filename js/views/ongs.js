import { DB, uid, saveTable, usuarioById, membrosDaOng } from '../db.js';
import { currentUser } from '../state.js';

export function setupOngs(afterChange) {
  // Delegação de evento: o formulário é recriado a cada render, então
  // ouvimos no container fixo em vez de reanexar o listener toda hora.
  document.getElementById('ongFormHolder').addEventListener('submit', async (e) => {
    if (e.target.id !== 'formOng') return;
    e.preventDefault();

    const cnpj = document.getElementById('oCnpj').value.trim();
    const nome = document.getElementById('oNome').value.trim();
    const usuario = currentUser();

    if (DB.ongs.some((o) => o.cnpj === cnpj)) {
      alert('Já existe uma ONG com esse CNPJ.');
      return;
    }

    const novaOng = { id: uid('O'), cnpj, nome };
    DB.ongs.push(novaOng);
    // Quem cadastra a ONG já entra como membro administrador dela.
    DB.membros.push({ usuario: usuario.id, ong: novaOng.id, adm_ong: true });

    await saveTable('ongs');
    await saveTable('membros');
    afterChange();
  });

  document.getElementById('ongList').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="vincular"]');
    if (!btn) return;
    const usuario = currentUser();
    if (!usuario) return;

    DB.membros.push({ usuario: usuario.id, ong: btn.dataset.ong, adm_ong: false });
    await saveTable('membros');
    afterChange();
  });
}

export function renderOngs() {
  renderOngForm();
  renderOngList();
}

function renderOngForm() {
  const holder = document.getElementById('ongFormHolder');
  const usuario = currentUser();

  if (!usuario) {
    holder.innerHTML = `<div class="notice">Entre com sua conta para poder cadastrar uma ONG.</div>`;
    return;
  }

  holder.innerHTML = `
    <form class="panel" id="formOng">
      <h3>Cadastrar nova ONG</h3>
      <label>CNPJ</label><input type="text" id="oCnpj" required>
      <label>Nome da organização</label><input type="text" id="oNome" placeholder="ex: Amigos do Bairro">
      <button class="btn" type="submit">Cadastrar ONG</button>
    </form>`;
}

function renderOngList() {
  const list = document.getElementById('ongList');
  const usuario = currentUser();

  if (DB.ongs.length === 0) {
    list.innerHTML = `<p class="empty">Nenhuma ONG cadastrada ainda.</p>`;
    return;
  }

  list.innerHTML = DB.ongs
    .map((ong) => {
      const membros = membrosDaOng(ong.id);
      const souMembro = usuario && membros.some((m) => m.usuario === usuario.id);
      const souAdmin = usuario && membros.some((m) => m.usuario === usuario.id && m.adm_ong);

      const membrosHtml =
        membros
          .map((m) => {
            const usr = usuarioById(m.usuario);
            return `<div class="meta">• ${usr ? usr.nome_usuario : '?'} ${m.adm_ong ? '<span class="tag">admin</span>' : ''}</div>`;
          })
          .join('') || '<p class="empty">Sem membros ainda.</p>';

      return `<div class="card">
        <h3>${ong.nome || '(sem nome informado)'}</h3>
        <p class="meta">CNPJ: ${ong.cnpj}</p>
        <p class="meta">id_cadastro_ONG: ${ong.id}</p>
        <div class="section-gap">${membrosHtml}</div>
        ${usuario && !souMembro ? `<button class="btn small" data-action="vincular" data-ong="${ong.id}">Vincular-me como membro</button>` : ''}
        ${!usuario ? '<p class="meta ext-note">Entre para se vincular a esta ONG.</p>' : ''}
        ${souMembro ? `<p class="meta ext-note">Você já é membro${souAdmin ? ' (administrador)' : ''}.</p>` : ''}
      </div>`;
    })
    .join('');
}
