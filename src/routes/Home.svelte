<script>
  /**DATA******************************************************/
  import { State, Store } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";

  /**COMPONENTS*************************************************/
  import Header from "../components/Header.svelte";
  import ProductsLinks from "../components/ProductsLinks.svelte";
  import Contacts from "../components/Contacts.svelte";

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
    <div class="infobox">
      <p>
        Informazioni sul servizio come orari e costo coperto. <br />
        Lorem ipsum dolor sit amet consectetur. Elementum laoreet commodo blandit
        magna sit.
      </p>
    </div>
    <Contacts />
  </section>
</div>

<style>
  .infobox {
    padding: 1em;
    margin-bottom: 2em;
  }
  section {
    /* padding-bottom: 6em; */
    padding-bottom: 0;
  }
</style>
