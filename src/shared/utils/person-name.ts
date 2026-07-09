/** Letters and spaces only — strips digits and special characters. */
export function filterPersonNameInput(value: string): string {
	return value.replace(/[^a-zA-Z\s]/g, "");
}
