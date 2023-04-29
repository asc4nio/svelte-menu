<script>
    export let showModal; // boolean
    export let item;

    let dialog; // HTMLDialogElement

    $: if (dialog && showModal) dialog.showModal();

    const body = document.querySelector("body");
    $: dialog && showModal
        ? body.classList.add("lockscroll")
        : body.classList.remove("lockscroll");
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    bind:this={dialog}
    on:close={() => (showModal = false)}
    on:click|self|stopPropagation={() => dialog.close()}
>
    <div on:click|stopPropagation>
        <!-- <slot name="header" />
		<slot /> -->
        <div class="header">
            <h3>{item.name}</h3>
            <button autofocus on:click={() => dialog.close()}>X</button>
        </div>
        <div class="content">
            {#if item.isFrozen}
                <div class="item">
                    <img src="./img/icons/icon-item-frozen.svg" alt="" />
                    <p>Contiene ingredienti surgelati</p>
                </div>
            {/if}
            {#if item.isGlutenfree}
                <div class="item">
                    <img src="./img/icons/icon-item-glutenfree.svg" alt="" />
                    <p>Prodotto senza glutine</p>
                </div>
            {/if}
            {#if item.isMilkfree}
                <div class="item">
                    <img src="./img/icons/icon-item-milkfree.svg" alt="" />
                    <p>Prodotto senza lattosio</p>
                </div>
            {/if}
            {#if item.isVegetarian}
                <div class="item">
                    <img src="./img/icons/icon-item-vegetarian.svg" alt="" />
                    <p>Prodotto vegetariano</p>
                </div>
            {/if}
        </div>
    </div>
</dialog>

<style>
    .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    
        padding-bottom: 1em;
        margin-bottom: 1em;

        border: 0.16rem;
        border-color: var(--col-mid);
        border-style: solid;
        border-top: none;
        border-left: none;
        border-right: none;
    }
    /* .content {} */
    .item{
        display: flex;
        align-items: center;
        justify-content: left;
    }
    img{
        width: 2rem;
        height: 2rem;
        margin-right: 1em;
    }
    dialog {
        margin-left: 1em;
        margin-right: 1em;
        width: auto;
        max-width: 540px;

        border-radius: 1em;
        border: none;
        padding: 0;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
        padding: 1em;
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
    }
</style>
