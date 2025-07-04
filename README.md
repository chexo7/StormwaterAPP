# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create an `.env.local` file with your API keys:
   ```
   GEMINI_API_KEY=your-gemini-key
   GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```
   Replace `your-google-maps-key` with `AIzaSyBsEK-S5Kbf5aqYol5eGv8uYcPgLOlObr4` if you wish to use the provided key.
   Note: Google Maps tiles will display a "for development purposes only" watermark if the API key is not fully configured.
   To remove the watermark, ensure billing is enabled for your Google Cloud project and that the key is authorized for your domain.
3. Run the app:
   `npm run dev`
4. Start the backend server in another terminal:
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

## Shapefile requirements

Uploaded archives must contain a `.prj` file describing the layer's
projection. Layers are automatically reprojected to **EPSG:3857** so
they align with the map background. Archives missing a projection file
are rejected.
