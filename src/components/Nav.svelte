<script>
    import { State, Store } from "../stores/Menu.js";
    import UIDATA from "../stores/UiData.js";

    import { push, pop, replace, location } from "svelte-spa-router";

    $: console.log("$location", $location);

    import Favs from "./Favs.svelte";
    import NavRouteSwitch from "./NavRouteSwitch.svelte";

    const toggleFavs = () => {
        $State.isFavOpen = !$State.isFavOpen;
    };

    const toggleLang = () => {
        $State.lang === UIDATA.LANGS[0]
            ? ($State.lang = UIDATA.LANGS[1])
            : ($State.lang = UIDATA.LANGS[0]);
    };

    $: otherLang =
        $State.lang == UIDATA.LANGS[0]
            ? (otherLang = UIDATA.LANGS[1])
            : (otherLang = UIDATA.LANGS[0]);

    $: favsCount = $Store.favs.length;

    const goToHome = () => {
        if ($State.isFavOpen) {
            $State.isFavOpen = false;
        }
        push("/");
    };

    $: showNavRouteSwitch = false
    const toggleNavRouteSwitch = () => {
        showNavRouteSwitch = !showNavRouteSwitch
    };
</script>

<nav>
    <div class="inner-nav">
        <button on:click={() => toggleLang()}>
            <img src="./img/icons/navlang.svg" alt="" />
            {otherLang}
        </button>
        {#if $location !== "/"}
            <button on:click={() => goToHome()}>
                <img src="./img/icons/menu-on.svg" alt="" />
            </button>
        {:else}
            <button on:click={() => toggleNavRouteSwitch()}>
                <img src="./img/icons/menu-on.svg" alt="" />
                {#if showNavRouteSwitch}
                    <NavRouteSwitch />
                {/if}
            </button>            
        {/if}
        <button on:click={() => toggleFavs()}>
            {#if favsCount > 0}
                <img src="./img/icons/navfav-on.svg" alt="" />
                {favsCount}
            {:else}
                <img src="./img/icons/navfav-off.svg" alt="" />
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
        right: 0em;
        left: 0em;

        padding-left: 0.5em;
        padding-right: 0.5em;
    }

    .inner-nav {
        max-width: 540px;
        margin-left: auto;
        margin-right: auto;

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0.5em 2em;

        border-radius: 1rem;

        background-color: rgb(255, 255, 255);

        filter: drop-shadow(0rem 0rem 1rem rgba(40, 35, 31, 0.2));
    }

    button {
        position: relative;
        background-color: transparent;
        border: none;
        padding: 0;
        margin: 0;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    img {
        height: 2rem;
    }

    button {
        width: 2rem;
    }
</style>
