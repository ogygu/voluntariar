import { DB, resetAll } from '../db.js';
import { logout } from '../state.js';

export function setupBancoDados(afterReset) {
  document.getElementById('resetDbBtn').addEventListener('click', async () => {
    const ok = confirm(
      'Isso vai apagar TODOS os dados (usuários, ONGs, membros, projetos e voluntariados) salvos neste navegador. Continuar?'
    );
    if (!ok) return;

    await resetAll();
    logout();
    afterReset();
  });
}

export function renderBancoDados() {
  const holder = document.getElementById('dbTables');
  const mask = (s) => (s ? '•'.repeat(Math.min(s.length, 8)) : '');

  holder.innerHTML = `
    <table class="dbtable"><caption>Cadastro_Usuario</caption>
      <tr><th>id_cadastro_voluntario</th><th>nome</th><th>email</th><th>CPF</th><th>nome_usuario</th><th>senha</th></tr>
      ${
        DB.usuarios
          .map((u) => `<tr><td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td><td>${u.cpf}</td><td>${u.nome_usuario}</td><td>${mask(u.senha)}</td></tr>`)
          .join('') || '<tr><td colspan="6" class="empty">vazio</td></tr>'
      }
    </table>
    <table class="dbtable"><caption>Cadastro_ONG <span class="ext-note">(nome é campo extra)</span></caption>
      <tr><th>id_cadastro_ONG</th><th>CNPJ</th><th>nome*</th></tr>
      ${
        DB.ongs.map((o) => `<tr><td>${o.id}</td><td>${o.cnpj}</td><td>${o.nome || ''}</td></tr>`).join('') ||
        '<tr><td colspan="3" class="empty">vazio</td></tr>'
      }
    </table>
    <table class="dbtable"><caption>Membro</caption>
      <tr><th>usuario (FK)</th><th>ong (FK)</th><th>adm_ong</th></tr>
      ${
        DB.membros
          .map((m) => `<tr><td>${m.usuario}</td><td>${m.ong}</td><td>${m.adm_ong ? 'true' : 'false'}</td></tr>`)
          .join('') || '<tr><td colspan="3" class="empty">vazio</td></tr>'
      }
    </table>
    <table class="dbtable"><caption>Projetos <span class="ext-note">(titulo/descricao são campos extras)</span></caption>
      <tr><th>id_projeto</th><th>ong (FK)</th><th>titulo*</th><th>descricao*</th></tr>
      ${
        DB.projetos
          .map((p) => `<tr><td>${p.id}</td><td>${p.ong}</td><td>${p.titulo}</td><td>${p.descricao}</td></tr>`)
          .join('') || '<tr><td colspan="4" class="empty">vazio</td></tr>'
      }
    </table>
    <table class="dbtable"><caption>Voluntariado</caption>
      <tr><th>usuario (FK)</th><th>projeto (FK)</th><th>status</th></tr>
      ${
        DB.voluntariados
          .map((v) => `<tr><td>${v.usuario}</td><td>${v.projeto}</td><td>${v.status}</td></tr>`)
          .join('') || '<tr><td colspan="3" class="empty">vazio</td></tr>'
      }
    </table>
  `;
}
