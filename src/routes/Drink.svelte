<script>
	import { State } from "../stores/Menu.js";
	import UIDATA from "../stores/UiData.js";
	import { DrinkData } from "../stores/ProductData.js";

	import ProductGroup from "../components/ProductGroup.svelte";
	import ProductHead from "../components/ProductHead.svelte";

	import {
		fade,
		blur,
		fly,
		slide,
		scale,
		draw,
		crossfade,
	} from "svelte/transition";

	$DrinkData.map((item, index) => {
		item.id = "drink" + index;
	});

	let viniRossi = $DrinkData.filter((i) => i.group === "Vino rosso");
	let viniBianchi = $DrinkData.filter((i) => i.group === "Vino bianco");
	let birre = $DrinkData.filter((i) => i.group === "Birra");
	let analcolici = $DrinkData.filter(
		(i) => i.group === "Analcolici" || i.group === "Bar"
	);
	const drinkGroups = [viniRossi, viniBianchi, birre, analcolici];

	$: console.log("$State.lang", $State.lang);

	// const body = document.querySelector('body')
	// $: $State.isFavOpen? body.classList.add("lockscroll") : body.classList.remove("lockscroll")
</script>

<div
	class="page"
	in:fade={{ duration: 200, delay: 200 }}
	out:fade={{ duration: 200 }}
>
	<main>
		<ProductHead img={"./img/drink-head.jpeg"}>
			<h1 slot="head">{UIDATA.PRODUCTGROUPS[1][$State.lang].title}</h1>
			<div slot="sub">
				Accompagna il tuo pasto con uno dei nostri deliziosi drink!
				Dalla nostra selezione di vini pregiati alle bevande
				analcoliche, c'è qualcosa per accontentare ogni palato.
			</div>
		</ProductHead>
		<ProductGroup groups={drinkGroups} groupName="drink" />

		<div class="product-link">
			<a href="#/food/">
				<button> 
					{UIDATA.PRODUCTGROUPS[0][$State.lang].subtitle}
					food 
				</button>
			</a>
		</div>
	</main>
</div>

<style>
	main {
		padding-bottom: 7em;
	}
	.product-link{
		padding: 2em;
	}
</style>
