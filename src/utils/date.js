export const formatMonthYear = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
};

export const getDayOfMonth = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getDate();
};

export const formatMonthShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', { month: 'short' });
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return `Hari ini, ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};
