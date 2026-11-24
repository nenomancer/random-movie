<script lang="ts">
  import { onDestroy } from "svelte";
  import { TYPING_MS_PER_CHAR } from "../../lib/constants";
  import { charsVisible } from "../../lib/typewriter";

  export let text: string;
  // How assistive tech treats the message:
  //  alert       - interrupts and is read out at once (errors)
  //  status      - polite live region (loading)
  //  plain       - ordinary text, no live announcement
  //  decorative  - hidden from screen readers (duplicate of another message)
  export let mode: "alert" | "status" | "plain" | "decorative" = "alert";
  export let speed: number = TYPING_MS_PER_CHAR;

  let shown = 0;
  let frame = 0;

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function start(value: string) {
    stop();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown = value.length;
      return;
    }

    shown = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      shown = charsVisible(now - startedAt, speed, value.length);
      frame = shown < value.length ? requestAnimationFrame(tick) : 0;
    };
    frame = requestAnimationFrame(tick);
  }

  // Re-type whenever the message changes
  $: start(text);
  onDestroy(stop);

  $: typed = text.slice(0, shown);
  $: typing = shown < text.length;
</script>

<p
  class="sys-msg typed"
  role={mode === "alert" || mode === "status" ? mode : undefined}
  aria-hidden={mode === "decorative" ? "true" : undefined}
>
  {#if mode !== "decorative"}
    <!-- Screen readers get the whole message at once, not letter by letter -->
    <span class="sr-only">{text}</span>
  {/if}
  <span class="stack" aria-hidden="true">
    <!-- Invisible full text reserves the final height so nothing jumps -->
    <span class="sizer">{text}</span>
    <span class="live"
      >{typed}{#if typing}<span class="cursor"></span>{/if}</span
    >
  </span>
</p>

<style>
  /* Typed prefixes must wrap like the full text, so no balancing here.
     Flex row: the "> " prompt sits left, the text block fills the rest and
     wraps beside it instead of dropping below it. */
  .typed {
    display: flex;
    align-items: flex-start;
    text-wrap: wrap;
  }

  .typed::before {
    flex: none;
    white-space: pre;
  }

  .stack {
    display: grid;
    flex: 1;
    min-width: 0;
  }

  .sizer,
  .live {
    grid-area: 1 / 1;
  }

  .sizer {
    visibility: hidden;
  }

  /* Solid block, only present while typing. The messages are uppercase, so
     the block is cap-height and sits on the baseline (an empty inline-block's
     baseline is its bottom edge). Tweak --cap-height if the font changes. */
  .cursor {
    --cap-height: 0.7em;
    display: inline-block;
    width: 0.5em;
    height: var(--cap-height);
    margin-left: 0.1em;
    vertical-align: baseline;
    background-color: currentColor;
  }
</style>
