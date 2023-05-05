<script>
  import { State, Store } from "../stores/Menu.js";
  import UIDATA from "../stores/UiData.js";
</script>

<div class="container">
  <!-- <h2>{UIDATA.CONTACTS.title[$State.lang]}</h2> -->
  <h2>{UIDATA.CONTACTS.heading1[$State.lang]}</h2>
  <!-- <p>{UIDATA.CONTACTS.subtitle[$State.lang]}</p>
 -->
  <div class="contact-items">
    <div class="contact-item">
      <img src="./img/icons/icon-call.svg" alt="" />
      <p>+39 0967 1234567</p>
    </div>
    <div class="contact-item">
      <img src="./img/icons/icon-whatsapp.svg" alt="" />
      <p>+39 333 1234567</p>
    </div>
    <div class="contact-item">
      <img src="./img/icons/icon-mail.svg" alt="" />
      <p>info@ristorante.it</p>
    </div>
  </div>

  <!-- <h3>{UIDATA.CONTACTS.heading2[$State.lang]}</h3> -->
</div>

<style>
  .container {
    /* display: flex;
    flex-direction: column; */

    padding: 2em;
    background-color: var(--col-mid);

    border-radius: 2em 2em 0 0;

    padding-bottom: 8em;

    box-shadow: inset 0 0 1rem rgba(0, 0, 0, 0.2);

    text-align: center;
  }

  .contact-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    margin-top: 1em;
  }
  .contact-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  img {
    width: 1.5em;
    margin-right: 1em;
  }
</style>
