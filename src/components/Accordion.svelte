<script>
	import { slide } from "svelte/transition";
	export let isOpen = false
	const toggle = (e) => {
        isOpen = !isOpen
        }
</script>


<button class="{isOpen ? 'accordion-toggle active': 'accordion-toggle'}" on:click={()=>{toggle()}} aria-expanded={isOpen} >
    <slot name="head" />
    <svg class="accordion-icon" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 5l7 7-7 7"></path>
    </svg> 
</button>

{#if isOpen}
    <div class="accordion-content" transition:slide={{ duration: 300 }}>
        <slot name="details" />
    </div>
{/if}


<style>
	.accordion-toggle {
        width: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;

        border: none; 
        background: none;
        color: inherit; 
        cursor: pointer; 

        margin: 0; 
        padding: 1rem 2rem;

        transition-property: background-color;
        transition-duration: 100ms;
        transition-delay: 200ms;

        border: 0.16rem;
        border-color: var(--col-mid);
        border-style: solid;
        border-top: none;
        border-left: none;
        border-right: none;
    }

    .accordion-toggle.active{
        background-color: var(--col-mid);
        transition-property: background-color;
        transition-delay: 0ms;
    }

	svg { transition: transform 0.2s ease-in;
    }
	
	[aria-expanded=true] svg { transform: rotate(0.75turn); }

    .accordion-content{
        padding-top: 1rem;
        padding-bottom: 2rem;
        padding-left: 1rem;
        padding-right: 1rem;
        background-color: var(--col-mid);
    }

    .accordion-icon{
        width: 1.5rem;
        height: 1.5rem;

        transform: rotate(0.25turn)
    }
</style>




