<script>
    export let item;
    // console.log(item);

    import UIDATA from "../stores/UiData.js";
    import { State, Store } from "../stores/Menu.js";

    import ProductCard from "./ProductCard.svelte";
    import ProductFavIcon from "./ProductFavIcon.svelte";

    let name;
    let description;
    let altSize;
    let altCost;

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

<ProductCard {item}>
    <div class=item-content>
        <div class="item-head">
            <h3>{item[name]}</h3>
        </div>
        <div class="item-body">
            <p class="description">{item[description]}, {item.size}</p>
            <!-- <p>{item.size}</p> -->
        </div>
            <h3>€ {item.cost}</h3>

        {#if item.altSize !== ""}
            <div class="alt-item">
                {item[altSize]} <br />
                € {item[altCost]} <br />
            </div>
        {/if}
        <ProductFavIcon {item} />
    </div>
</ProductCard>

<style>
    .item-content {
        padding: 1em;
    }
    /* .item-head {}
    .item-body {} */
    .description {
        margin-top: 1em;
        margin-bottom: 1em;
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
