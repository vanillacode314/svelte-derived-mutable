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
	for (const value of keys) {
		deepTrack(value);
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

function derivedMutable<T>(init: () => T): { value: T } {
	const state = $derived.by(() => {
		let state = $state(unwrap(deepTrack(init())));
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

export { derivedMutable };
