<script>
    export let item;

    import { prevent_default } from "svelte/internal";
    import Modal from "./Modal.svelte";
    let showModal = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icons" on:click|capture|stopPropagation={() => (showModal = true)}>
    {#if item.isFrozen}
        <img src="./img/icons/icon-item-frozen.svg" alt="" />
    {/if}
    {#if item.isGlutenfree}
        <img src="./img/icons/icon-item-glutenfree.svg" alt="" />
    {/if}
    {#if item.isMilkfree}
        <img src="./img/icons/icon-item-milkfree.svg" alt="" />
    {/if}
    {#if item.isVegetarian}
        <img src="./img/icons/icon-item-vegetarian.svg" alt="" />
    {/if}
</div>

<Modal {item} bind:showModal >
    <!-- <div slot="header">
    <h3>
        {item.name}
    </h3>

    </div>

    {#if item.isFrozen}
        <img src="./img/icons/icon-item-frozen.svg" alt="" />
        <p>Contiene ingredienti surgelati</p>
    {/if}
    {#if item.isGlutenfree}
        <img src="./img/icons/icon-item-glutenfree.svg" alt="" />
        <p>Prodotto senza glutine</p>
    {/if}
    {#if item.isMilkfree}
        <img src="./img/icons/icon-item-milkfree.svg" alt="" />
        <p>Prodotto senza lattosio</p>
    {/if}
    {#if item.isVegetarian}
        <img src="./img/icons/icon-item-vegetarian.svg" alt="" />
        <p>Prodotto vegetariano</p>
    {/if} -->
</Modal>

<style>
    /* .icons{} */
</style>
