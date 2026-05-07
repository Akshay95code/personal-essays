# personal-essays

Keep everything simple and minimal. Do not add extra features, animations, styling flourishes, or complexity unless I explicitly ask for them. Always communicate with me in a calm, thoughtful, wise tone. When making changes to this site, do the least invasive thing that achieves the goal.

## Writing style

Never use em dashes (— or &mdash;) anywhere on this site, in essay content, labels, titles, or footers. Use a comma, a colon, a full stop, or rewrite the sentence instead.

## Adding a new essay

When asked to write or add a new essay:

1. Create a new HTML file in the project root. Use a short, descriptive slug as the filename (e.g. `why-i-left-big-tech.html`).
2. Use `vibe-coding-2041.html` as the template — copy its structure exactly, including the dark mode toggle, "← All essays" back link, and copy-link button.
3. Update the `<title>` tag to reflect the new essay title.
4. Update the `essay-title` label with the correct month and year.
5. Update the `essay-heading` h2 with the essay title. The essay title is the first thing after the back link — large, bold, prominent. Do not include the author name at the top; it already appears in the footer.
6. Replace the essay body with the new content.
7. Add a new `<li>` entry to the essay list in `index.html`, following the existing format: title on the left, month + year on the right.

## Copy-link button

Each essay page has a small circular icon button below the footer that copies the page URL to the clipboard. When clicked, it presses in (scale 0.82), swaps to a checkmark icon, then reverts to the link icon after 1.6 seconds. The button uses `id="copy-link"` and must be initialized via JavaScript at the bottom of the page script. The CSS class `.pressed` triggers the scale animation.

## Dark mode toggle

The dark mode toggle button uses `#theme-toggle:active { transform: scale(0.85); }` with `transform 0.15s ease` in its transition to give it a press-in click feel. This must be present on every page.

## Reading time

Each essay page displays a reading time estimate appended to the `essay-title` label (e.g. "May 2026 · 4 min read"). It is calculated in JavaScript at the bottom of the page script, after the copy-link button is initialized:

```js
const words = document.querySelector('.essay').innerText.trim().split(/\s+/).length;
const mins = Math.ceil(words / 238);
document.querySelector('.essay-title').textContent += ' · ' + mins + ' min read';
```

This must be included on every essay page.
