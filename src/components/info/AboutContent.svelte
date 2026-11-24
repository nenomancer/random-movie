<script lang="ts">
  export let isMain: Boolean = true;
</script>

{#if isMain}
  <section>
    <h2>About</h2>
    <p>
      Just hit the big "Search" button and find your next hidden gem. Discover
      titles dating back to 1878!
    </p>

    <h2>Features</h2>
    <ul>
      <li>
        Click on a year, country, rating, runtime, genre, director or cast
        member to find another movie that matches.
      </li>
      <li>
        Filter by country, genre, a range of release years, or rating. They stay
        on while you click around (except for cast and directors).
      </li>
      <li>Keep track of the last 6 results.</li>
    </ul>

    <h2>Disclaimer</h2>
    <p>
      This project is still in progress. It might fail at times, and some things
      might not work as expected.
    </p>
    <h3>Currently known issues:</h3>
    <ul>
      <li>Many of the listed countries won't produce a result.</li>
      <li>
        Adult movies sometimes sneak in disguised as Drama, Romance or
        Documentary.
      </li>
      <li>Very narrow year or rating ranges rarely find a result.</li>
      <li>
        The repo is a mess, but
        <a
          href="https://github.com/nenomancer/random-movie"
          target="_blank"
          rel="noopener noreferrer"
        >
          take a look
        </a>
        if you want.
      </li>
    </ul>

    <p>
      This product uses the
      <a
        href="https://developer.themoviedb.org/reference/"
        target="_blank"
        rel="noopener noreferrer"
      >
        TMDB API
      </a>
      but is not endorsed or certified by
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        The Movie Database
      </a>.
    </p>
    <h2>Contact</h2>
    <p>
      If you have any feedback or suggestions, reach out to me by
      <a href="mailto:nebojsa.kovacevik@gmail.com">email</a> or on
      <a
        href="https://www.instagram.com/loopmaster.n/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Instagram
      </a>.
    </p>
  </section>
{/if}
{#if !isMain}
  <div class="image">About this website.</div>
{/if}

<style lang="scss">
  .image {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100%;
  }

  p {
    justify-self: center;
    align-self: center;
  }

  h2 {
    font-size: 2.2rem;
  }

  h3 {
    font-size: 1.4rem;
  }

  p,
  ul {
    margin-bottom: 1rem;
    padding-inline: 0.5rem;
  }
</style>
