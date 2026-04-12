export function sanitizeReturnTo(value: string | null, def: string): string {
	if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
		return def;
	}
	return value;
}
