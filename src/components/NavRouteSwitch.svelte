<script>
    import { State, Store } from "../stores/Menu.js";
    import UIDATA from "../stores/UiData.js";

    import { push, pop, replace } from "svelte-spa-router";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher()

    const goToSwitch = () => {
        if ($State.isFavOpen) {
            $State.isFavOpen = false
        }
        dispatch('NavRouteSwitch');
        // push('/')
    };

</script>

<div class="nav-switch">
    <a href="#/food/">
        <button on:click={() => goToSwitch()}>
            food
        </button>
    </a>
    <a href="#/drink/">
        <button on:click={() => goToSwitch()}>
            drinks
        </button>
    </a>
    <a href="#/">
        <button on:click={() => goToSwitch()}>
            home
        </button>
    </a>
</div>

<style>
    .nav-switch{
        position: absolute;
        top: auto;
        bottom: 100%;
        left: auto;
        right: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        padding: 1em;

        background-color: var(--col-highlight);
    }

    button{
        margin: 0.5em;
    }


</style>
