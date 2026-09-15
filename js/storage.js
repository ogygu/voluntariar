// Camada de persistência.
// Hoje guarda tudo no localStorage do navegador. Se um dia vocês quiserem
// trocar por uma API/back-end de verdade, só este arquivo precisa mudar —
// o resto do app só conhece getItem/setItem/removeItem.

const PREFIX = 'voluntariar:';

export async function getItem(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler', key, err);
    return null;
  }
}

export async function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('Erro ao salvar', key, err);
    return false;
  }
}

export async function removeItems(keys) {
  keys.forEach((k) => localStorage.removeItem(PREFIX + k));
}
