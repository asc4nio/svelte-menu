<script>
	/**
		https://www.youtube.com/watch?v=O-4uc9UOYcE
	*/
	
	import Router from 'svelte-spa-router'
	
    import Home from './routes/Home.svelte';
    import Food from './routes/Food.svelte';
    import Drink from './routes/Drink.svelte';
    // import NotFound from './routes/NotFound.svelte';

	import Nav from "./components/Nav.svelte";
    import { State } from './stores/Menu';



	let routes = {
		'/' : Home,
		'/food/' : Food,
		'/drink' : Drink,
		'*' : Home
		// '*' : NotFound
	}

	$: innerWidth = 0
	$: innerHeight = 0
	$: $State.appWidth = innerWidth
	$: $State.appHeight = innerHeight

	$: console.log($State.appWidth,$State.appHeight )

</script>

<svelte:window bind:innerWidth bind:innerHeight />
<main>
	<Router {routes} />
	<Nav/>
</main>

<style>
</style>