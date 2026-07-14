# Wildsea – Foundry VTT 14 System

A modern implementation of **The Wildsea** character sheets for [Foundry VTT](https://foundryvtt.com/) (compatible with version 14).

![Player Sheet](https://i.imgur.com/8oHSKRu.png)

---

## Installation
### From GitHub (recommended)
1. Open the **Install System** dialog in Foundry VTT.
2. Paste the following manifest URL and click **Install**:
   ```
   https://raw.githubusercontent.com/digennarot/wildsea/refs/heads/main/system.json
   ```
   This will download the latest release (v1.0.0) which includes the fully‑migrated system without any jQuery dependencies.

### Manual installation (if you prefer the repo)
1. Clone the repository:
   ```bash
   git clone https://github.com/digennarot/wildsea.git
   cd wildsea
   ```
2. Build the distribution ZIP:
   ```bash
   npm run build:zip
   ```
3. In Foundry, go to **Add‑On > Systems > Install System** and upload the generated `wildsea‑v14.zip`.

---

## Features
- Fully migrated to **ApplicationV2** APIs (no jQuery).
- Native DOM event handling for tracks, items, dice pools, and dialogs.
- Supports all original Wildsea mechanics and assets.
- Includes a build script for easy packaging.

---

## Development
```bash
# Install dependencies (if any are added later)
npm install
# Run a local build
npm run build:zip
```

Feel free to open issues or submit pull requests on the GitHub repository.

---

## License & Credits
- Original artwork and design by **Felix Isaacs**.
- This port is maintained by **tizia** (GitHub: @digennarot).
- Licensed under the **MIT License**.
