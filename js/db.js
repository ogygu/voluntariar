import { getItem, setItem, removeItems } from './storage.js';

// As 5 entidades do modelo lógico do minimundo.
const TABLES = ['usuarios', 'ongs', 'membros', 'projetos', 'voluntariados'];

export const DB = {
  usuarios: [],      // Cadastro_Usuario
  ongs: [],          // Cadastro_ONG
  membros: [],       // Membro (associativa Usuario <-> ONG)
  projetos: [],      // Projetos
  voluntariados: [], // Voluntariado (associativa Usuario <-> Projeto)
};

export function uid(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function loadAll() {
  for (const table of TABLES) {
    const value = await getItem(table);
    DB[table] = value || [];
  }
}

export async function saveTable(name) {
  await setItem(name, DB[name]);
}

export async function resetAll() {
  TABLES.forEach((t) => (DB[t] = []));
  await removeItems(TABLES);
}

/* ---------- lookups usados pelas views ---------- */
export const ongById = (id) => DB.ongs.find((o) => o.id === id);
export const usuarioById = (id) => DB.usuarios.find((u) => u.id === id);
export const projetoById = (id) => DB.projetos.find((p) => p.id === id);
export const membrosDaOng = (ongId) => DB.membros.filter((m) => m.ong === ongId);
