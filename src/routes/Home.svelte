<script>
	/**DATA******************************************************/
	import { State, Store } from "../stores/Menu.js";
	import UIDATA from "../stores/UiData.js";

	/**COMPONENTS*************************************************/
	import Header from "../components/Header.svelte";
	import HomeLinks from "../components/HomeLinks.svelte";

	import {
		fade,
		blur,
		fly,
		slide,
		scale,
		draw,
		crossfade,
	} from "svelte/transition";
</script>

<div
	class="page"
	in:fade={{ delay: 400, duration: 400 }}
	out:fade={{ duration: 400 }}
>
	<main>
		<Header />
		<HomeLinks />
		<p>
			Footer lorem ipsum dolor sit amet
		</p>
	</main>
</div>

<style>
	main {
		padding-bottom: 7em;
	}
</style>
