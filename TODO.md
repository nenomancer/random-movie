# TODO

Update this file as items are done or added.

## Next up
- [ ] Keyboard navigation: focus order, return focus to the opener when a dropdown closes
      (Escape handler on genre options is fixed; focus is still lost afterwards), visible focus styles
- [ ] Check contrast and screen-reader behaviour with axe / Lighthouse in the browser

## Later
- [ ] Open Graph / Twitter tags so shared `/movie/:id` links look good
- [ ] Friendlier error screen copy, and a clear state for an invalid movie ID in the URL
- [ ] Try removing `rollup` (dependencies) and `@rollup/rollup-linux-x64-gnu` (optionalDependencies)
      workarounds; test with a Netlify deploy preview first
- [ ] Sass deprecations (`darken`, `lighten`, `desaturate`, global built-ins) before upgrading to Dart Sass 3
- [ ] Check the ~45 "unused CSS selector" warnings one by one in the UI; some may be styles that never apply
      to child components (`:global` needed), not dead code
- [ ] Prettier config (indentation and quotes are mixed across files)
- [ ] Component tests (needs jsdom + @testing-library/svelte), e.g. ERROR-tab behaviour

## Decisions / parked
- Analytics: direct gtag only; the GTM container (GTM-KKRQJZH5) was removed from `index.html`. No tags in it.
- Unimported components kept on purpose until decided: `Disk`, `Extras`, `Tab`, `Tabs`, `FilterActors`,
  plus `public/nrmg-favicon.svg`.
