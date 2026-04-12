import type { User, Session } from 'better-auth/minimal';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			onconsider?: (
				event: CustomEvent<import('svelte-dnd-action').DndEvent<any>> & { target: EventTarget & T }
			) => void;
			onfinalize?: (
				event: CustomEvent<import('svelte-dnd-action').DndEvent<any>> & { target: EventTarget & T }
			) => void;
		}
	}
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
