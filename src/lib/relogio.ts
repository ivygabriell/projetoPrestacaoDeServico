const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const doisDigitos = (n: number) => String(n).padStart(2, '0');

// Formato do relógio do cabeçalho: "REC ter13:07:05".
export const relogio = (d: Date) =>
  `REC ${DIAS[d.getDay()]}${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}:${doisDigitos(d.getSeconds())}`;
