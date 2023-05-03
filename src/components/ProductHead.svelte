<script>
  export let img;
</script>

<div class="container">
  <div class="image-container">
    <img src={img} alt="" />
    <div class="page-name">
      <slot name="head" />
    </div>
  </div>
  <div class="page-description">
    <slot name="sub" />
  </div>
</div>

<style>
  .container {
    padding: 1em;
    padding-top: 0;

    margin-bottom: 2em;
  }
  .image-container {
    position: relative;

    display: flex;
    align-items: baseline;
    justify-content: center;

    margin-bottom: 2em;
  }
  .page-name {
    position: absolute;
    top: auto;
    bottom: 0;
    left: auto;
    right: auto;
    background-color: var(--col-light);

    padding: 1em 2em;
    padding-bottom: 0;

    border-radius: 1em 1em 0 0;
  }
  img {
    width: 100%;
    max-height: 12rem;
    object-fit: cover;

    border-radius: 0 0 2rem 2rem;

    margin-bottom: 1rem;
  }

  .page-description {
    padding: 0 1em;
    text-align: center;
  }
</style>
