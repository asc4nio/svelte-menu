<script>
  import { State } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";
  import { FoodData } from "../stores/ProductData.js";

  import ProductGroup from "../components/ProductGroup.svelte";
  import ProductHead from "../components/ProductHead.svelte";
  import ProductsLinks from "../components/ProductsLinks.svelte";

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

<div
  class="page"
  in:fade={{ duration: 200, delay: 200 }}
  out:fade={{ duration: 200 }}
>
  <ProductHead img={"./img/food-head.jpeg"}>
    <h1 slot="head">{UIDATA.PRODUCTGROUPS[0][$State.lang].title}</h1>
    <div slot="sub">
      <p class="p-big">
        Scopri i nostri deliziosi piatti creati con ingredienti freschi e di
        alta qualità.
      </p>
      <p>
        Dalla ricca selezione di antipasti ai piatti principali di carne e
        pesce.
      </p>
    </div>
  </ProductHead>

  <ProductGroup groups={foodGroups} groupName="food" />
  <ProductsLinks foodLink={false} drinkLink={true} smallImage={true} />
</div>

<style>
  .page {
    padding-bottom: 6em;
  }
</style>
