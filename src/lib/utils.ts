type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];
import { browser } from '$app/environment';

export function formatDate(
	date: string | undefined,
	dateStyle: DateStyle = 'medium',
	locales = 'en'
) {
	if (!date) return '';
	const dateToFormat = new Date(date.replaceAll('-', '/'));
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}

export const toggleDarkMode = (mode: number = -1) => {
	if (browser) {
		const html = document.documentElement;
		html.classList.add('app-ui');

		if (mode == -1) mode = html.classList.contains('dark') ? 0 : 1;
		if (mode === 1) {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}
	}
};
