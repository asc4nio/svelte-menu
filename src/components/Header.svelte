<script>
    import {State} from "../stores/Menu.js";
    import UIDATA from '../stores/UiData.js'

    let title = UIDATA.HEADER
    $: subtitle = UIDATA.SUBHEADER[$State.lang]

</script>

<header>
    <div class="header-image">
        <img src="./img/header.jpg" alt="" />
        <div class="page-title">
            <h1>{title}</h1>
        </div>
    </div>


    <div class="sub-header">
        <p class="p-big">
            {subtitle}
        </p>
    </div>
</header>





<style>
    header{
        position: relative;
    }
    .header-image{
        position: relative;
    }
    img{
        width: 100%;
        height: 100%;
        max-height: 50vh;

        object-fit: cover;
    }

    .page-title{
        background-color: var(--col-light);
        position: absolute;
        top: auto;
        bottom: 0;
        left: 0;
        right: auto;

        padding-top: 1rem;
        padding-left: 2rem;
        padding-right: 4rem;
        padding-bottom: 0rem;

        border-radius: 0rem 2rem 0rem 0rem;
    }

    .sub-header {
        padding: 1rem 2rem;
    }

    @media screen and (min-width: 541px) {
        header{
            padding-left: 1em;
            padding-right: 1em;
        }
        img{
            border-radius: 0 0 2em 0;
        }
    }

</style>