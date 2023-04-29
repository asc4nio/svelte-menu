<script>
    export let item;

    import { prevent_default } from "svelte/internal";
    import Modal from "./Modal.svelte";
    let showModal = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icons" on:click={() => (showModal = true)}>
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

<Modal bind:showModal>
    <div slot="header">
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
    {/if}

    <!-- <ol class="definition-list">
		<li>of or relating to modality in logic</li>
		<li>
			containing provisions as to the mode of procedure or the manner of taking effect —used of a contract or legacy
		</li>
		<li>of or relating to a musical mode</li>
		<li>of or relating to structure as opposed to substance</li>
		<li>of, relating to, or constituting a grammatical form or category characteristically indicating predication</li>
		<li>of or relating to a statistical mode</li>
	</ol>

	<a href="https://www.merriam-webster.com/dictionary/modal">merriam-webster.com</a> -->
</Modal>

<style>
    /* .icons{} */
</style>
