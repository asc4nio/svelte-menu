<script>
    export let item
    import { State, Store } from "../stores/Menu.js";
    $: isAlreadyFav = $Store.favs.includes(item.id);

</script>

<div class="item-fav-icon">
    {#if isAlreadyFav}
        <img src="./img/icons/icon-favitem-on.svg" alt=""/>
    {:else}
        <img src="./img/icons/icon-favitem-off.svg" alt=""/>
    {/if}
</div>

<style>
    .item-fav-icon{
        position: absolute;
        top: 0.5em;
        bottom: auto;
        left: auto;
        right: 0.5em;
    }
</style>