<script>
  import { State } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";
  import { DrinkData } from "../stores/ProductData.js";

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
  <ProductHead img={"./img/drink-head.jpeg"}>
    <h1 slot="head">{UIDATA.PRODUCTGROUPS[1][$State.lang].title}</h1>
    <div slot="sub">
      <p class="p-big">
        Accompagna il tuo pasto con uno dei nostri deliziosi drink!
      </p>
      <p>
        Dalla nostra selezione di vini pregiati alle bevande analcoliche, c'è
        qualcosa per accontentare ogni palato.
      </p>
    </div>
  </ProductHead>

  <ProductGroup groups={drinkGroups} groupName="drink" />

  <ProductsLinks foodLink={true} drinkLink={false} smallImage={true} />
</div>

<style>
  .page {
    padding-bottom: 6em;
  }
</style>
