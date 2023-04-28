<script>
    // export let isOpen;

    import UIDATA from "../stores/UiData.js";
    import { State, Store } from "../stores/Menu.js";

    import FavsCard from "./FavsCard.svelte";

    import { FoodData, DrinkData } from "../stores/ProductData.js";

    const clearFavs = (itemId) => {
        $Store.favs = [];
        $State.isFavOpen = false;
    };

    $: favsCount = $Store.favs.length;

    $: titleText = UIDATA.FAVSTITLE[$State.lang]
    $: clearButtonText = UIDATA.FAVSCLEARBUTTON[$State.lang]

</script>

{#if $State.isFavOpen}
    <main id="favs">
        <h1>{titleText}</h1>
        {#if favsCount > 0}
            <div id="favs-list">
                {#each $Store.favs as id}
                    {#each $FoodData as item}
                        {#if item.id === id}
                            <FavsCard {item} on:emptyFav />
                        {/if}
                    {/each}
                    {#each $DrinkData as item}
                        {#if item.id === id}
                            <FavsCard {item} on:emptyFav />
                        {/if}
                    {/each}
                {/each}
            </div>
            <button on:click={clearFavs}>{clearButtonText}</button>
        {:else}
            <p>Clicca su un prodotto per aggiungerlo ai preferiti.</p>
        {/if}
    </main>
{/if}

<style>
    #favs {
        background-color: var(--col-mid);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        overflow: auto;

        padding: 1em;
    }
    h1 {
        margin-bottom: 1em;
    }
    #favs-list {
        padding: 1em;
    }
</style>
