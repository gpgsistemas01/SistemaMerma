export const formatShortDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('es-MX', options);
}

export const formatLongDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('es-MX', options);
}

export const formatRelativeDate = (date) => {
  const now = Date.now();
  const d = new Date(date);
  const diff = (now - d) / 1000;

  if (diff < 60) return `hace ${ Math.floor(diff) }s`;
  if (diff < 3600) return `hace ${ Math.floor(diff / 60) } min`;
  if (diff < 86400) return `hace ${ Math.floor(diff / 3600) } h`;
  if (diff < 604800) return `hace ${ Math.floor(diff / 86400) } ${ Math.floor(diff / 86400) === 1 ? 'día' : 'días'}`;
  if (diff < 2592000) return `hace ${ Math.floor(diff / 604800) } ${ Math.floor(diff / 604800) === 1 ? 'semana' : 'semanas'}`;

  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-');

export const unslugify = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());