<script>
export let img
</script>

<div class="container">
    <img src="{img}" alt="" />
    <slot name="head"/>
    <slot name="sub"/>
</div>



<style>
    .container{
        padding: 1em;
        padding-top: 0;
    }
    img{
        width: 100%;
        max-height: 15rem;
        object-fit: cover;

        border-radius: 0 0 2rem 2rem;

        margin-bottom: 1rem;
    }

</style>