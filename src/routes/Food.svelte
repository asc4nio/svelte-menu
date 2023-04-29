<script>
	import { State } from "../stores/Menu.js";
	import UIDATA from "../stores/UiData.js";
	import { FoodData } from "../stores/ProductData.js";

	import Nav from "../components/Nav.svelte";
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

	$FoodData.map((item, index) => {
		item.id = "food" + index;
	});

	let antipasti = $FoodData.filter((i) => i.group === "Antipasti");
	let primi = $FoodData.filter((i) => i.group === "Primi");
	let secondi = $FoodData.filter((i) => i.group === "Secondi");
	let dessert = $FoodData.filter((i) => i.group === "Dessert");
	const foodGroups = [antipasti, primi, secondi, dessert];

	$: console.log("$State.lang", $State.lang);

</script>

<div class="page" in:fly="{{delay:400, duration:400, x: '100%'}}" out:fly="{{duration:400, x:'100%'}}">

<main>
	<ProductHead img={'./img/food-head.jpeg'}>
		<h1 slot="head">food {$State.lang}</h1>
		<div slot="sub">
			Scopri i nostri deliziosi piatti creati con ingredienti freschi e di alta qualità, dalla ricca selezione di antipasti ai piatti principali di carne e pesce.
		</div>
	</ProductHead>

	<ProductGroup groups={foodGroups} groupName="food" />
	<Nav />
</main>
</div>
