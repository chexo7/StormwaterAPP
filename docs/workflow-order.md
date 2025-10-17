# Stormwater Input Workflow Checklist

This checklist captures the sequencing rules that keep the revised hydrologic workflow consistent. Update it whenever prerequisites change so future refactors keep the guardrails in sync.

1. **Load Drainage Areas**
   - Upload the `Drainage Areas` layer (ZIPs named like `DA-TO-DP.zip` are auto-detected).
   - Assign a unique **Discharge Point #** (`DP-01` … `DP-10`) to every polygon.
   - Do not continue until all polygons display a formatted DP value.

2. **Load Drainage Subareas**
   - Once every Drainage Area polygon has a DP, upload the `Drainage Subareas` layer (ZIPs like `SUB-DA.zip`).
   - For each subarea polygon pick a `DRAINAGE AREA - #` name and link it to one of the available Drainage Area discharge points.
   - Ensure the set of subareas tied to a DP fully covers the parent Drainage Area (the processor will auto-create complements for any remainder).

3. **Load LOD**
   - Upload the `LOD` layer at any point; it does not gate other datasets but is required before computing.

4. **Load WSS Soils Whenever Available**
   - The `Soil Layer from Web Soil Survey` upload is now always available; bring it in as soon as you have the zipped WSS deliverable.
   - The backend queries SDA using each MUSYM and auto-fills the dominant `HSG`. Review the activity log to confirm progress and fill any polygons that remain blank.

5. **Load Land Cover**
   - After the WSS soil layer is present you can upload the `Land Cover` layer (ZIPs named `landcover.zip` remain auto-detected).
   - Confirm the imported features carry a `LAND_COVER` value for every polygon.

6. **Review Before Compute**
   - Confirm every layer needed for SCS calculations is present: `LOD`, `Drainage Areas`, `Drainage Subareas`, `Land Cover`, and `Soil Layer from Web Soil Survey`.
   - Spot-check logs for auto-generated complements or trimming notices before running the compute overlay.

Keep this list close to the upload logic and update both when requirements evolve.
