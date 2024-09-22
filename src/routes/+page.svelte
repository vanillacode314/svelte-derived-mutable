<script lang="ts">
	import { derivedMutable } from '$lib/index.svelte';

	let foo = $state({ a: 1, b: 2, c: { d: 3 } });
	const bar = derivedMutable(() => $state.snapshot(foo.c));
	setTimeout(() => (bar.value.d = 4), 1000);
	setTimeout(() => (foo.c.d = 5), 2000);
</script>

<p>
	{foo.c.d}
</p>
<p>
	{JSON.stringify(bar.value)}
</p>
