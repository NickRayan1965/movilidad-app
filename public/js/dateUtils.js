function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ''; // fecha inválida
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  let formatted = new Intl.DateTimeFormat("es-ES", options).format(date);
  return formatted;
}
