<script>
  import { State, Store } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";
</script>

<div class="container">
  <!-- <h2>{UIDATA.CONTACTS.title[$State.lang]}</h2> -->
  <h2>{UIDATA.CONTACTS.heading1[$State.lang]}</h2>
  <p>{UIDATA.CONTACTS.subtitle[$State.lang]}</p>

  <h3>{UIDATA.CONTACTS.heading2[$State.lang]}</h3>
</div>

<style>
  .container {
    padding: 2em;
    background-color: var(--col-mid);

    border-radius: 2em 2em 0 0;

    padding-bottom: 6em;

    box-shadow: inset 0 0 1rem rgba(0, 0, 0, 0.2);

    text-align: center;
  }
</style>
