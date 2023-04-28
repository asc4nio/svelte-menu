<script>
	/**
		https://www.youtube.com/watch?v=O-4uc9UOYcE
	*/
	
	import Router from 'svelte-spa-router'
	
    import Home from './routes/Home.svelte';
    import Food from './routes/Food.svelte';
    import Drink from './routes/Drink.svelte';
    // import NotFound from './routes/NotFound.svelte';


	let routes = {
		'/' : Home,
		'/food/' : Food,
		'/drink' : Drink,
		'*' : Home
		// '*' : NotFound
	}

</script>

<main>
	<Router {routes} />
</main>

<style>
</style>