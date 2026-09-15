import { DB } from '../db.js';
import { login } from '../state.js';

export function setupEntrar(onLogin) {
  const form = document.getElementById('formEntrar');
  const msg = document.getElementById('entrarMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome_usuario = document.getElementById('eUsuario').value.trim();
    const senha = document.getElementById('eSenha').value;

    const usuario = DB.usuarios.find((u) => u.nome_usuario === nome_usuario && u.senha === senha);
    if (!usuario) {
      msg.innerHTML = `<div class="notice warn">Usuário ou senha incorretos.</div>`;
      return;
    }

    login(usuario.id);
    msg.innerHTML = `<div class="notice">Bem-vindo(a), ${usuario.nome}!</div>`;
    onLogin();
  });
}
