<script>
  export let foodLink = true;
  export let drinkLink = true;
  export let hasImage = true;
  export let smallImage = false;

  import { State, Store } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";

  let buttonClass;

  smallImage ? (buttonClass = "is--smallimage") : (buttonClass = "");
</script>

<div class="home-links">
  {#if foodLink}
    <a href="#/food/">
      <button class={buttonClass}>
        {#if hasImage}
          <div class="button-image-cont">
            <img
              class="button-image {buttonClass}"
              src="./img/food-head.jpeg"
              alt=""
            />
          </div>
        {/if}
        <div class="button-text-cont">
          <h2>{UIDATA.PRODUCTGROUPS[0][$State.lang].title}</h2>
          <p>{UIDATA.PRODUCTGROUPS[0][$State.lang].subtitle}</p>
        </div>
      </button>
    </a>
  {/if}
  {#if drinkLink}
    <a href="#/drink/">
      <button class={buttonClass}>
        {#if hasImage}
          <div class="button-image-cont">
            <img
              class="button-image {buttonClass}"
              src="./img/drink-head.jpeg"
              alt=""
            />
          </div>
        {/if}
        <div class="button-text-cont">
          <h2>{UIDATA.PRODUCTGROUPS[1][$State.lang].title}</h2>
          <p>
            {UIDATA.PRODUCTGROUPS[1][$State.lang].subtitle}
          </p>
        </div>
      </button>
    </a>
  {/if}
</div>

<style>
  .home-links {
    padding: 1em;
  }
  button {
    width: 100%;
    margin-bottom: 1em;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    background-color: var(--col-highlight);
    border: none;
    border-radius: 1em;

    text-align: left;
    text-decoration: none;

    filter: drop-shadow(0rem 0rem 1rem rgba(40, 35, 31, 0.2));

    transition: transform 0.2s;
  }
  button.is--smallimage {
    padding: 1em;
    background-color: transparent;
    border-radius: 2em;
  }
  /* button.padding {
    padding: 1em;
    border-radius: 2em;
  } */

  button:active {
    transform: scale(0.95);
  }

  .button-image-cont {
    min-width: 50%;
    height: 12em;
  }
  .button-image {
    width: 100%;
    height: 100%;
    object-fit: cover;

    border-radius: 1em 0 0 1em;
  }
  .button-image.is--smallimage {
    border-radius: 1em 1em 1em 1em;
  }
  .button-text-cont {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    padding: 2em;
  }
  h2 {
    text-decoration: none;
  }
</style>
