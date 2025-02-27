export const extractIdFromUrl = (url: string): string => {
  try {
    const matches = url.match(/\/(\d+)\/?$/);
    return matches ? matches[1] : '';
  } catch {
    return '';
  }
};

export const formatNumber = (num: number): string => {
  return String(num).padStart(3, '0');
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
