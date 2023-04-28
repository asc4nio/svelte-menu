<script>
    export let item;
    console.log(item);

    import UIDATA from "../stores/UiData.js";
    import { State, Store } from "../stores/Menu.js";

    import ProductCard from "./ProductCard.svelte";
    import ProductIcons from "./ProductIcons.svelte";
    import ProductFavIcon from "./ProductFavIcon.svelte";

    let name;
    let description;

    $: if ($State.lang === UIDATA.LANGS[0]) {
        name = "name";
        description = "description";
    } else if ($State.lang === UIDATA.LANGS[1]) {
        name = "engName";
        description = "engDescription";
    }
</script>
<ProductCard {item}>
    <img src="./img/food/{item.img}" alt="" />

    <div class=item-content>
    <div class="item-head">
        <h3>{item[name]}</h3>
    </div>
    <div class="item-body">
        <p class="description">{item[description]}</p>
    </div>
    <div class="item-foot">
        <h3>€ {item.cost}</h3>
        <ProductIcons {item} />
    </div>
        <ProductFavIcon {item} />
    </div>

</ProductCard>

<style>
    img {
        width: 100%;
        border-radius: 1em 1em 0em 0em;
    }
    .item-content {
        position: relative;
        padding: 1em;
    }
    .item-head {
        margin-right: 3em;
    }
    /* .item-body {} */
    .item-foot {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .description {
        margin-top: 1em;
        margin-bottom: 1em;
    }
</style>
