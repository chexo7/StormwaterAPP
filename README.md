# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.local.example` to `.env.local` and add your API keys:
   ```
   GEMINI_API_KEY=your-gemini-key
   GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```
   Note: Google Maps tiles will display a "for development purposes only" watermark if the API key is not fully configured.
   To remove the watermark, ensure billing is enabled for your Google Cloud project and that the key is authorized for your domain.
3. Run the app:
   `npm run dev`
4. Start the backend server in another terminal:
   `npm run backend`
   You can control how many log entries the server keeps by setting the
   `LOG_LIMIT` environment variable (defaults to `100`).

## Geospatial utilities

The backend exposes two endpoints using Turf.js for polygon processing:

* `POST /api/intersect` accepts `{ poly1, poly2 }` GeoJSON polygons and returns
  their intersection or `null` if they do not overlap.
* `POST /api/area` accepts `{ polygon }` and returns `{ area }` in square meters.

An additional route serves SCS Curve Number lookup data used for hydrologic
analysis:

* `GET /api/cn-values` returns the contents of `public/data/SCS_CN_VALUES.json`.

  The JSON maps land cover descriptions to arrays of Curve Number records, each
  providing values for hydrologic soil groups A–D as listed in the TR‐55 tables.
  Duplicated descriptions therefore hold multiple CN sets to cover different
  conditions.

This allows the frontend to fetch the table of CN values based on soil group.

These routes are ready for future integration with the frontend.

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

## Exporting results

After computing results, click **Export** in the header to open the export modal. Provide a project name and select a version (V1–V10) to determine the filename. The modal currently supports exporting to HydroCAD using templates from `export_templates/hydrocad/`.
