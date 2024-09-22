# svelte-derived-mutable

Helper function to create a derived rune in svelte 5 which can be mutated 

## Usage

```svelte
<script>
	import { derivedMutable } from '@vanillacode314/svelte-derived-mutable';

	async function createTodo(title) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		// NOTE: appending on server to demonstrate the derivation behaviour
		todos.push(title + ' on server');
	}

	let todos = $state(['a', 'b', 'c']);
	// NOTE: use $state.snapshot to deepTrack the value
	const optimisticTodos = derivedMutable(() => $state.snapshot(todos));

	async function addTodo(title) {
		optimisticTodos.value.push(title);
		await createTodo(title);
	}
</script>

<ul>
	{#each optimisticTodos.value as todo}
		<li>{todo}</li>
	{/each}
</ul>
<button onclick={() => addTodo('test')}>Add Todo</button>
```

## Behavior

- The intial value is derived from the passed function.
- Does not deeptrack the value by default. If you want to deepTrack the value use `$state.snapshot` like the usage example.
- To access the value both when getting or setting the value needs to be done using `.value` property regardless of whether the value is primitive or object.
- On setting the value, only the derived store value is updated, not the original store value.
- Any changes made will be overwritten when the derivation function runs again.

## Tips

### When to and not to deeptrack

- deepTrack if you will be mutating the parent state used in derivation function. Like the usage example.
- do not deepTrack if you will always be replacing the parent state used in derivation function. Like setting the parent state from an api call for example.

## Installation

### Download the code directly in your codebase (Recommended)

Run this command where you want to download the file
```sh
curl "https://raw.githubusercontent.com/vanillacode314/svelte-derived-mutable/refs/heads/main/src/lib/index.svelte.ts" -o svelte-derived-mutable.svelte.ts
```

### Install from npm

```sh
npm install @vanillacode314/svelte-derived-mutable
yarn add @vanillacode314/svelte-derived-mutable
pnpm add @vanillacode314/svelte-derived-mutable
bun add @vanillacode314/svelte-derived-mutable
```
