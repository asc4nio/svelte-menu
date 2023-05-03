<script>
  export let groups;
  export let groupName;

  import { State, Store } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";
  import Accordion from "./Accordion.svelte";
  import DrinkItem from "./DrinkItem.svelte";
  import FoodItem from "../components/FoodItem.svelte";

  console.log(groupName);

  let accordionTitle;

  if (groupName === "food") {
    accordionTitle = UIDATA.FOODGROUPS;
  } else if (groupName === "drink") {
    accordionTitle = UIDATA.DRINKGROUPS;
  } else {
    accordionTitle = "set it properly";
  }
</script>

<div class="products-group">
  {#each groups as group, index}
    <Accordion isOpen={false}>
      <div slot="head">
        <h1>{accordionTitle[$State.lang][index]}</h1>
      </div>
      <div slot="details">
        {#each group as item, index}
          {#if groupName === "drink"}
            <DrinkItem {item} />
          {:else if groupName === "food"}
            <FoodItem {item} />
          {/if}
        {/each}
      </div>
    </Accordion>
  {/each}
</div>

<style>
  .products-group {
    margin-bottom: 3em;
  }
</style>
