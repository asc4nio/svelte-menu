<script>
    export let item

    let isFrozen
    let isGlutenfree;
    let isMilkfree;
    let isVegetarian;

</script>

<div class="icons">
    {#if item.isFrozen}
        <img src="./img/icons/icon-item-frozen.svg" alt=""/>
    {/if}
    {#if item.isGlutenfree}
        <img src="./img/icons/icon-item-glutenfree.svg" alt=""/>
    {/if}
    {#if item.isMilkfree}
        <img src="./img/icons/icon-item-milkfree.svg" alt=""/>
    {/if}
    {#if item.isVegetarian}
    <img src="./img/icons/icon-item-vegetarian.svg" alt=""/>
    {/if}
</div>



<style>
    /* .icons{} */

</style>