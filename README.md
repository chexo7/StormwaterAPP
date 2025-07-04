# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Optionally set `GOOGLE_MAPS_API_KEY` in the same file if you want to enable Google Maps tiles
4. Run the app:
   `npm run dev`
5. Start the backend server in another terminal:
   `npm run backend`

## Update soil HSG mapping

The file `public/data/soil-hsg-map.json` contains a mapping from soil map unit
symbols (MUSYM) to hydrologic soil groups (HSG). A utility script is
provided to refresh this mapping using the USDA Soil Data Access API.

Run the script with Python. Without arguments it downloads data for all
survey areas which may take a long time:

```bash
python scripts/update_soil_hsg_map.py      # fetch all areas
```

For a much quicker update you can fetch all MUSYM/HSG pairs in a single
query with the ``--fast`` option (this downloads a large dataset):

```bash
python scripts/update_soil_hsg_map.py --fast
```

You can limit the update to specific area symbols:

```bash
python scripts/update_soil_hsg_map.py --areas CA630 CA649
```

## Desktop layout

The default styles target 1080p displays but scale gracefully up to 4K
monitors. Base font sizes and sidebar widths increase on very large
screens to keep the interface readable while remaining fully responsive.
