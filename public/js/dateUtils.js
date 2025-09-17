function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return ''; // fecha inválida
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  let formatted = new Intl.DateTimeFormat("es-ES", options).format(date);
  return formatted;
}
function getWeekDay(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  return dias[date.getDay()];
}
function getDayNumber(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.getDate();
}
