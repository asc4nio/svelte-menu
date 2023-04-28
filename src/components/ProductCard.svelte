<script>
    export let item
    // console.log(item)

    import UIDATA from "../stores/UiData.js";
    import { State, Store } from "../stores/Menu.js";
    // import ProductFavIcon from "./ProductFavIcon.svelte";

    let cardFavClass = "";
    $: isAlreadyFav = $Store.favs.includes(item.id);
    $: isAlreadyFav ? (cardFavClass = "is--fav") : (cardFavClass = "");


    const clickFav = (itemId) => {
        console.log(itemId)
		let clickedItemId = itemId
		let isAlreadyFav = $Store.favs.includes(clickedItemId);

		if (!isAlreadyFav) {
			$Store.favs = [...$Store.favs, clickedItemId];
		} else {
			$Store.favs = $Store.favs.filter((i) => i !== clickedItemId);
		}

        console.log($Store.favs)
	};

</script>


    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="card {cardFavClass}" on:click={() => clickFav(item.id)}>
        <slot>
        </slot>
        <!-- <ProductFavIcon isFav={isAlreadyFav} /> -->
    </div>

<style>
    .card{
        background-color: var(--col-light);
        margin-bottom: 2rem;

        border-radius: 1rem;

        transition: scale 0.2s;
        filter: drop-shadow(0rem 0rem 1rem rgba(40,35,31,0.2) );
    }

    .card.is--fav{
        background-color: var(--col-highlight);
        scale: 0.95;
    }
</style>