<script>
    export let item;

    import UIDATA from "../stores/UiData.js";
    import { State, Store } from "../stores/Menu.js";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    const removeFav = (itemId) => {
        let clickedItemId = itemId;
        $Store.favs = $Store.favs.filter((i) => i !== clickedItemId);

        if ($Store.favs.length === 0) {
            dispatch("emptyFav");
            console.log("emptyFav");
        }
    };

    $: name = '';
    $: description = '';
    $: altSize = '';
    $: altCost = '';

    $: if ($State.lang === UIDATA.LANGS[0]) {
        name = "name";
        description = "description";
        altSize = "altSize";
        altCost = "altCost";
    } else if ($State.lang === UIDATA.LANGS[1]) {
        name = "engName";
        description = "engDescription";
        altSize = "engAltSize";
        altCost = "engAltCost";
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card" on:click={() => removeFav(item.id)}>
    <h3>{item[name]}</h3>
    <p>{item[description]}</p>
    <h3>{item.cost}</h3>

    {#if item.altSize && item.altSize !== ""}
    <div class="alt-item">
        {item[altSize]} <br />
        € {item[altCost]} <br />
    </div>
    {/if}

    <div class="fav-icon">
        <img src="./img/icons/icon-favitem-on.svg" alt="" />
    </div>
</div>

<style>
    .card {
        position: relative;
        background-color: var(--col-light);
        margin-bottom: 1em;

        border-radius: 1rem;

        padding: 1em;

        filter: drop-shadow(0rem 0rem 1rem rgba(40, 35, 31, 0.2));
    }
    .fav-icon {
        position: absolute;
        top: 0.5em;
        bottom: auto;
        left: auto;
        right: 0.5em;
    }

    .alt-item{
        margin-top: 1em;
        padding-top: 1em;
        border: 0.16rem;
        border-color: var(--col-mid) ;
        border-style: solid;
        border-left: none;
        border-right: none;
        border-bottom: none;

    }
</style>
