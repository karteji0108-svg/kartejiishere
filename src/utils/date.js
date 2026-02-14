export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', options);
};

export const formatMonthYear = (dateString) => {
  return formatDate(dateString, { month: 'long', year: 'numeric' });
};

export const getDay = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getDate();
};

export const getMonthShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', { month: 'short' });
};

export const formatFullDate = (dateString) => {
  return formatDate(dateString, { day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatFullDateWithDay = (dateString) => {
  return formatDate(dateString, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const formatDateShort = (dateString) => {
  return formatDate(dateString, { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatAnnouncementsDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Hari ini, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return formatDate(dateString, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatDateDefault = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};
