import { writable } from 'svelte/store';

type NotifyType = 'info' | 'success' | 'error' | 'warning';
type NotifyOptions = {
	type: NotifyType;
	duration: number;
	action?: { label: string; callback: () => void } | null;
	canClose: boolean;
};
type Notification = {
	id: number;
	message: string;
	options: NotifyOptions;
};

function createNotificationStore() {
	const { subscribe, update } = writable<Notification[]>([]);
	let notifyId = 0;

	return {
		subscribe,
		add: (message: string, options: Partial<NotifyOptions> = {}) => {
			const id = notifyId++;
			const notify: Notification = {
				id,
				message,
				options: {
					type: options.type || 'info',
					duration: options.duration ?? 3000,
					action: options.action || null,
					canClose: options.canClose ?? true
				}
			};

			update((notifications) => [...notifications, notify]);

			if (notify.options.duration > 0) {
				setTimeout(() => notifyStore.remove(id), notify.options.duration);
			}

			return id;
		},
		remove: (id: number) => {
			update((notifications) => notifications.filter((n) => n.id !== id));
		}
	};
}

export const notifyStore = createNotificationStore();
export type { Notification, NotifyOptions, NotifyType };