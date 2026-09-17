export function getFormattedRequestNumber(req: any, index?: number): string {
  if (index !== undefined && index !== null && index >= 0) {
    return `#${index + 1}`;
  }
  if (!req) return '#1';

  if (typeof req === 'number') {
    return `#${req}`;
  }

  if (typeof req === 'string') {
    if (/^\d+$/.test(req)) return `#${req}`;
    if (req.startsWith('#')) return req;
    if (req.startsWith('sr-') || req.startsWith('SR-')) {
      const num = req.replace(/sr-/i, '');
      if (/^\d+$/.test(num)) return `#${num}`;
    }
    return `#1`;
  }

  if (req.requestNumber) {
    return String(req.requestNumber).startsWith('#') ? String(req.requestNumber) : `#${req.requestNumber}`;
  }
  if (req.ticketNumber) {
    return String(req.ticketNumber).startsWith('#') ? String(req.ticketNumber) : `#${req.ticketNumber}`;
  }
  if (req.serialNumber || req.seqNo) {
    return `#${req.serialNumber || req.seqNo}`;
  }

  return '#1';
}

export function formatDateTime(dateInput?: Date | string | number | null): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

