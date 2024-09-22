import { untrack } from 'svelte';

/**
 * Helper function to create a derived rune in svelte 5 which can be mutated
 *
 * @template T - type of your rune value
 * @param formula - function that returns the derived value
 * @returns A derived rune that can be mutated using .value acceessor
 */
export function derivedMutable<T>(formula: () => T): { value: T } {
	const state = $derived.by(() => {
		const value = formula();
		let state = $state(untrack(() => $state.snapshot(value) as T));
		return {
			get value() {
				return state;
			},
			set value(v) {
				state = v;
			}
		};
	});

	return {
		get value() {
			return state.value;
		},
		set value(v) {
			state.value = v;
		}
	};
}
