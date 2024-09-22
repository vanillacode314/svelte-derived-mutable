function isObject(value: unknown) {
	return value !== null && typeof value === 'object';
}

function deepTrack<T>(input: T): T {
	if (!isObject(input)) return input;
	if (Array.isArray(input)) return input.map(deepTrack) as T;
	const keys = [
		...Object.getOwnPropertyNames(input),
		...Object.getOwnPropertySymbols(input)
	] as (keyof typeof input)[];
	for (const key of keys) {
		deepTrack(input[key]);
	}
	return input;
}

function unwrap<T>(input: T): T {
	if (!isObject(input)) return input;
	if (Array.isArray(input)) return input.map(unwrap) as T;
	const keys = [
		...Object.getOwnPropertyNames(input),
		...Object.getOwnPropertySymbols(input)
	] as (keyof typeof input)[];
	const retval = {} as typeof input;
	for (const key of keys) {
		retval[key] = unwrap(input[key]);
	}
	return retval;
}

/**
 * Helper function to create a derived rune in svelte 5 which can be mutated
 *
 * @template T - type of your rune value
 * @param formula - function that returns the derived value
 * @returns A derived rune that can be mutated using .value acceessor
 */
export function derivedMutable<T>(formula: () => T): { value: T } {
	const state = $derived.by(() => {
		let state = $state(unwrap(deepTrack(formula())));
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
