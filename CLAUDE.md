# hello-world

Interactive web app with 3 modal buttons: weather, date/time, and version.

## Stack
- **Runtime**: Node.js + Express 4
- **Frontend**: Single-page, vanilla HTML/CSS/JS (`public/index.html`)
- **No build step** — static files served directly

## Structure
```
server.js          # Entry point — Express server, API routes
public/index.html  # All frontend: layout, styles, modal logic
package.json       # version field is exposed via /api/version
```

## API routes
| Route | Description |
|---|---|
| `GET /api/weather` | Proxies wttr.in to avoid browser CORS restrictions |
| `GET /api/version` | Returns `{ version }` from package.json |
| `GET /*` | Serves `public/` as static files |

## Encoding
UTF-8 everywhere — enforced via `.editorconfig`. In `server.js` the wttr.in response stream uses `setEncoding('utf8')`; `res.json()` sends `charset=utf-8` automatically; `public/index.html` has `<meta charset="UTF-8">`.

## Run
```bash
npm start   # http://localhost:3000
```
