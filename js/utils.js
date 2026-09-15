export function statusLabel(status) {
  const labels = {
    pendente: 'PENDENTE',
    aprovado: 'APROVADO',
    recusado: 'RECUSADO',
    cancelado: 'CANCELADO',
  };
  return labels[status] || status.toUpperCase();
}
