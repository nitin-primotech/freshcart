/** Masks a 10-digit Indian mobile number for display. */
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length < 4) {
    return `+91 ${digits}`;
  }
  if (digits.length < 10) {
    return `+91 ${digits}`;
  }
  return `+91 ${digits.slice(0, 2)}••••${digits.slice(-2)}`;
}
