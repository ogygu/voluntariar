import { DB, uid, saveTable } from '../db.js';

export function setupCadastro() {
  const form = document.getElementById('formCadastro');
  const msg = document.getElementById('cadastroMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('cNome').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const cpf = document.getElementById('cCpf').value.trim();
    const nome_usuario = document.getElementById('cUsuario').value.trim();
    const senha = document.getElementById('cSenha').value;

    if (DB.usuarios.some((u) => u.nome_usuario === nome_usuario)) {
      msg.innerHTML = `<div class="notice warn">Esse nome de usuário já existe. Escolha outro.</div>`;
      return;
    }
    if (DB.usuarios.some((u) => u.cpf === cpf)) {
      msg.innerHTML = `<div class="notice warn">Já existe um cadastro com esse CPF.</div>`;
      return;
    }

    DB.usuarios.push({ id: uid('U'), nome, email, cpf, nome_usuario, senha });
    await saveTable('usuarios');

    msg.innerHTML = `<div class="notice">Cadastro criado! Agora vá até "Entrar" para acessar a plataforma.</div>`;
    form.reset();
  });
}
