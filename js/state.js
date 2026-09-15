import { DB } from './db.js';

// Sessão simples em memória — não é persistida entre recarregamentos de
// página de propósito (equivale a exigir login a cada nova sessão).
export const session = { userId: null };

export function currentUser() {
  return DB.usuarios.find((u) => u.id === session.userId) || null;
}

export function login(userId) {
  session.userId = userId;
}

export function logout() {
  session.userId = null;
}
