const INDIAN_MOBILE = /^[6-9]\d{9}$/;

export function sanitizeIndianPhoneInput(value: string): string {
	return value.replace(/\D/g, "").slice(0, 10);
}

export function isValidIndianMobile(phone: string): boolean {
	return INDIAN_MOBILE.test(phone);
}

export function formatIndianPhoneDisplay(phone: string): string {
	const digits = sanitizeIndianPhoneInput(phone);
	if (digits.length <= 5) return digits;
	return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}
