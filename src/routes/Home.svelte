<script>
  /**DATA******************************************************/
  import { State, Store } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";

  /**COMPONENTS*************************************************/
  import Header from "../components/Header.svelte";
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
</script>

<div
  class="page"
  in:fade={{ delay: 400, duration: 400 }}
  out:fade={{ duration: 400 }}
>
  <Header />
  <section>
    <ProductsLinks foodLink={true} drinkLink={true} />
    <p>Footer lorem ipsum dolor sit amet</p>
  </section>
</div>

<style>
  /* main {
    padding-bottom: 7em;
  } */
</style>
