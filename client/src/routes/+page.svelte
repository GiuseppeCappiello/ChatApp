<script>
  import { onMount } from 'svelte';
  import { idStore } from "../services/id";
  import { sendMessage } from "../socket";
  import { messagesStore } from "../state/messages";

  let i = -1;


  onMount(() => {
		const interval = setInterval(() => {
			i += 1;
			i %= "Homepage".length;
		}, 2500);

		return () => {
			clearInterval(interval);
		};
	});

  function typewriter(node, { speed = 1 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

  let messageInput = "";

  function handleSubmit() {
    if ($idStore) {
      sendMessage(messageInput, $idStore);
    }

    messageInput = "";
  }

  let listRef;

  $: {
    if (listRef) {
      listRef.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }
</script>

<header class="h-[10vh] grid place-items-center bg-slate-700">

  {#key i}
	<h1 class="text-teal-300 text-4xl font-mono" in:typewriter={{ speed: 1 }}>
    {"Homepage"}
  </h1>
{/key}
  
</header>

<main class="h-[90vh] grid grid-rows-12">

  <div
    class="list-wrapper overflow-y-scroll w-full flex justify-center bg-slate-300"
  >
    <ul
      bind:this={listRef}
      class="w-1/2 p-0 list-none flex flex-col gap-2 mt-2 mb-2"
    >
      {#each $messagesStore.reverse() as message}
        <li class="flex justify-between">
          {#if message.userid === $idStore}
            <div />
          {/if}

          <p
            class="p-3 max-w-[50vmin] w-fit text-slate-100 text-lg rounded-2xl break-words bg-slate-600 font-mono"
            class:user-message={message.userid === $idStore}
          >
            {message.content}
          </p>

          {#if message.userid !== $idStore}
            <div />
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <form
    class="w-screen flex justify-center items-center gap-4 bg-slate-800"
    on:submit|preventDefault={handleSubmit}
  >
    <input
      type="text"
      class="caret-pink-500 focus:outline focus:outline-2 focus:outline-pink-500 p-2 font-mono rounded-md w-1/2 bg-slate-200"
      bind:value={messageInput}
    />

    <button
      type="submit"
      class="bg-teal-400 p-2 rounded-xl font-mono text-slate-100 outline outline-none hover:outline-2 hover:outline-white"
      >Submit</button
    >
  </form>
</main>

<style>
  main {
    grid-template-rows: auto 80px;
  }

  .user-message {
    font-family: monospace;
    background-color: deepskyblue;
  }
</style>
