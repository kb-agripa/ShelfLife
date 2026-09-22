# ShelfLife

ShelfLife is a browser-based expiry tracker for a household. You add the food, medicine, and emergency go-bag supplies you own, each with its expiry or rotation date. The page counts the days left for every item, sorts the soonest to the top, and keeps a history of what you consumed, discarded, or removed.

It is built with HTML, CSS, and JavaScript only. There is no build step and no server. Data is saved in the browser with localStorage.

## How to run

Open `index.html` in a browser.

## Features

- Add an item with a name, a category (Fridge, Pantry, Medicine, Cosmetics, Go-bag), and a date. Past dates are allowed so an expired item can be recorded and discarded.
- Each item gets a status from its days left: Good (8 or more), Soon (4 to 7), Urgent (1 to 3), Use today (0), Expired (past the date).
- Search by name, sort by soonest, name, or category, and filter by category or by "needs attention" (3 days or fewer).
- Mark an item consumed (go-bag items are logged as rotated), discard it, or remove it.
- History of every action, with filters and a Restore button.
- Undo from the confirmation message for every action that removes something, including "Discard all expired", "Clear history", and "Reset demo data".
- "Expiring next" panel at the top of the page showing the three items with the fewest days left.
- Go-bag checklist, a savings estimate in Philippine pesos with its assumptions stated, and a short list of common questions.
- Light and dark colour schemes. The page follows the system setting until you pick System, Light, or Dark in the header.
- Demo sign-in that previews the signed-in header. No password is collected and nothing is sent anywhere.

## Files

```
index.html         page structure and text
css/style.css      colours, type, layout, and components
js/index.js        data, rendering, actions, and saving to localStorage
assets/fonts/      Poppins and IBM Plex Mono as woff2 files, with their licence note
```

## Data stored in the browser

| Key | Contents |
|---|---|
| `shelflife_items_v2` | items: `{ id, name, category, date }` with `date` as `YYYY-MM-DD` |
| `shelflife_history_v2` | records: `{ id, name, category, date, action, note, loggedAt }` |
| `shelflife_auth_user` | `{ email, name }` for the demo sign-in |
| `shelflife_theme` | `light` or `dark` when picked in the header |

`action` is `Consumed`, `Rotated`, `Discarded`, or `Removed`. Use "Reset demo data" in the tracker footer to restore the sample items. Clearing site data in the browser removes everything.

## Web Systems and Technology - Section H3101 - Group 11

- Jewel Vianne Impuesto
- Khorrane Bianca Agripa
- Juliana Alarcon
- John Florence Guillermo
