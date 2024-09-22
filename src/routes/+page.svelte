<script lang="ts">
	function isObject(value) {
		return value !== null && typeof value === 'object';
	}

	function deepTrack<T>(input: T): T {
		if (!isObject(input)) return input;
		for (const value of Object.values(input)) {
			deepTrack(value);
		}
		return input;
	}

	function unwrap<T>(input: T): T {
		if (!isObject(input)) return input;
		const retval = {} as T;
		for (const key of Object.keys(input)) {
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

	let foo = $state({ a: 1, b: 2, c: { d: 3 } });
	const bar = derivedMutable(() => foo.c);
	setTimeout(() => (bar.value = 4), 1000);
	setTimeout(() => (foo.c.d = 5), 2000);
</script>

<p>
	{foo.c.d}
</p>
<p>
	{JSON.stringify(bar.value)}
</p>
