<script>

	/**DATA******************************************************/
	import {State, Store} from "../stores/Menu.js";
	import UIDATA from "../stores/UiData.js";

	// import FavsStore from "../stores/FavsStore.js";

	/**COMPONENTS*************************************************/
	import Header from "../components/Header.svelte";
	import Nav from "../components/Nav.svelte";
	
	// import {push, pop, replace} from "svelte-spa-router"

	import { fade, blur, fly, slide, scale, draw, crossfade  } from 'svelte/transition';

	// const body = document.querySelector('body')
	// $: $State.isFavOpen? body.classList.add("lockscroll") : body.classList.remove("lockscroll")

</script>

<main>
	<Header />
	<div class="home-links">
		<a href="#/food/">
			<button>
				food
			</button>
		</a>
		<a href="#/drink/">
			<button>
				drinks
			</button>
		</a>
	</div>
	<Nav/>
</main>


<style>
	.home-links {
		padding: 1em;
	}
	button{
		width: 100%;
		height: 8em;
		margin-bottom: 1em;
	}
</style>