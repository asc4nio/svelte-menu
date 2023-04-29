<script>
    import UIDATA from "../stores/UiData.js";
    import { State, Store } from "../stores/Menu.js";

    import FavsCard from "./FavsCard.svelte";
    import {
        fade,
        blur,
        fly,
        slide,
        scale,
        draw,
        crossfade,
    } from "svelte/transition";

    import { FoodData, DrinkData } from "../stores/ProductData.js";

    const clearFavs = (itemId) => {
        $Store.favs = [];
        $State.isFavOpen = false;
    };

    $: favsCount = $Store.favs.length;

    const body = document.querySelector("body");
    $: $State.isFavOpen
        ? body.classList.add("lockscroll")
        : body.classList.remove("lockscroll");
</script>

<main
    id="favs"
    in:fly={{ duration: 400, y: "12em" }}
    out:fly={{ duration: 200, y: "12em" }}
>
    <div class="page is--fav">
        <div class="favs-head">
            <h1>{UIDATA.FAVS.title[$State.lang]}</h1>
            <button
                on:click={() => {
                    $State.isFavOpen = false;
                }}>X</button
            >
        </div>
        <div id="favs-list">
            {#if favsCount > 0}
                {#each $Store.favs as id}
                    {#each $DrinkData as item}
                        {#if item.id === id}
                            <FavsCard {item} on:emptyFav />
                        {/if}
                    {/each}
                    {#each $FoodData as item}
                        {#if item.id === id}
                            <FavsCard {item} on:emptyFav />
                        {/if}
                    {/each}
                {/each}

                <button on:click={clearFavs}>{UIDATA.FAVS.clearbutton[$State.lang]}</button>
            {:else}
                <p>{UIDATA.FAVS.tip[$State.lang]}</p>
            {/if}
        </div>
    </div>
</main>

<style>
    #favs {
        position: fixed;
        top: 1em;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);

        width: 100%;
        max-width: 540px;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        border-radius: 2em 2em 0 0;

        background-color: var(--col-mid);

        filter: drop-shadow(0rem 0rem 1rem rgba(40, 35, 31, 0.2));
    }
    .page.is--fav {
        position: absolute;
        top: 0;
        bottom: 0;

        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
    }
    .favs-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 1em 2em;

        border: 0.16rem;
        border-color: var(--col-light);
        border-style: solid;
        border-top: none;
        border-left: none;
        border-right: none;
    }
    #favs-list {
        padding: 1em 2em;
        overflow: auto;

        padding-bottom: 8em;
    }

    button {
        background-color: transparent;
        border: none;
        font-size: 1.5rem;
    }
</style>
