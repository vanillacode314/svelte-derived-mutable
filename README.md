# svelte-derived-mutable

Helper function to create a derived rune in svelte 5 which can be mutated 

## Usage

```svelte
<script>
	import { derivedMutable } from 'svelte-derived-mutable';

	async function createTodo(title) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		todos.push(title + ' on server'); // NOTE: appending on server to demonstrate the derivation behaviour
	}

	let todos = $state(['a', 'b', 'c']);
	const optimisticTodos = derivedMutable(() => todos);

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
- To access the value both when getting or setting the value needs to be done using `.value` property regardless of whether the value is primitive or object.
- On setting the value, only the derived store value is updated, not the original store value.
- Any changes made will be overwritten when the derivation function runs again.

## Installation

### Download the code directly in your codebase (Recommended)

Run this command where you want to download the file
```sh
curl "https://raw.githubusercontent.com/vanillacode314/svelte-derived-mutable/refs/heads/main/src/lib/index.svelte.ts" -o svelte-derived-mutable.svelte.ts
```

### Install as an npm package

```sh
npm install svelte-derived-mutable
yarn add svelte-derived-mutable
pnpm add svelte-derived-mutable
bun add svelte-derived-mutable
```
