<script>
    import { State } from "../stores/Menu.js";
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
        console.log("toggleLang", $State.lang);
    };

    const goHome = () => {
        if ($State.isFavOpen) {
            $State.isFavOpen = false
        }
        push('/')
    };
</script>

<nav>
    <button on:click={() => toggleLang()}> Lang </button>
    <!-- <a href="/"> -->
        <button on:click={() => goHome()}> Home </button>
    <!-- </a> -->
    <button on:click={() => toggleFavs()}> Favs </button>
</nav>

<Favs isOpen={$State.isFavOpen} on:emptyFav={toggleFavs} />

<style>
    nav {
        position: fixed;
        z-index: 100;
        top: auto;
        bottom: 1em;
        right: 0.5em;
        left: 0.5em;

        border-radius: 1rem;

        display: flex;
        align-content: center;
        justify-content: center;

        padding: 0.5rem 1rem;
        background-color: rgb(255, 255, 255);

        filter: drop-shadow(0rem 0rem 1rem rgba(40, 35, 31, 0.2));
    }
</style>
