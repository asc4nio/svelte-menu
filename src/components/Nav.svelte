<script>
    import { State, Store } from "../stores/Menu.js";
    import UIDATA from "../stores/UiData.js";

    import { push, pop, replace } from "svelte-spa-router";

    import Favs from "./Favs.svelte";

    const toggleFavs = () => {
        $State.isFavOpen = !$State.isFavOpen
    };

    const toggleLang = () => {
        $State.lang === UIDATA.LANGS[0]
            ? ($State.lang = UIDATA.LANGS[1])
            : ($State.lang = UIDATA.LANGS[0]);
    };

    $: otherLang = $State.lang == UIDATA.LANGS[0]
            ? (otherLang = UIDATA.LANGS[1])
            : (otherLang = UIDATA.LANGS[0]);

    $: favsCount = $Store.favs.length;

    const goToHome = () => {
        if ($State.isFavOpen) {
            $State.isFavOpen = false
        }
        push('/')
    };

</script>

<nav>
    <div class="inner-nav">
        <button on:click={() => toggleLang()}>
            <img src="./img/icons/navlang.svg" alt=""/>
             {otherLang} 
        </button>
        <button on:click={() => goToHome()}>
            <img src="./img/icons/menu-on.svg" alt=""/>
        </button>
        <button on:click={() => toggleFavs()}>
            {#if favsCount>0}
                <img src="./img/icons/navfav-on.svg" alt=""/>
                {favsCount}
            {:else}
                <img src="./img/icons/navfav-off.svg" alt=""/>
            {/if}
        </button>
    </div>
</nav>

{#if $State.isFavOpen}
    <Favs on:emptyFav={toggleFavs} />
{/if}


<style>
    nav {
        position: fixed;
        z-index: 100;
        top: auto;
        bottom: 1em;
        right: 0.5em;
        left: 0.5em;

        border-radius: 1rem;

        padding: 0.5rem 1rem;
        background-color: rgb(255, 255, 255);

        filter: drop-shadow(0rem 0rem 1rem rgba(40, 35, 31, 0.2));
    }

    .inner-nav{
        max-width: 540px;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding-left: 1em;
        padding-right: 1em;
    }

    button{
        position: relative;
        background-color: transparent;
        border: none;
    }

    img {
        height: 2rem;
    }

    button{
        width: 2rem;
    }
</style>
