# Stormwater Input Workflow Checklist

This checklist captures the sequencing rules that keep the revised hydrologic workflow consistent. Update it whenever prerequisites change so future refactors keep the guardrails in sync.

1. **Load Drainage Areas**
   - Upload the `Drainage Areas` layer (ZIPs named like `DA-TO-DP.zip` are auto-detected).
   - Assign a unique **Discharge Point #** (`DP-01` … `DP-20`) to every polygon.
   - Do not continue until all polygons display a formatted DP value.

2. **Load Drainage Subareas**
   - Once every Drainage Area polygon has a DP, upload the `Drainage Subareas` layer (ZIPs like `SUB-DA.zip`).
   - For each subarea polygon pick a `DRAINAGE AREA - #` name and link it to one of the available Drainage Area discharge points.
   - Ensure the set of subareas tied to a DP fully covers the parent Drainage Area (the processor will auto-create complements for any remainder).

3. **Load LOD and Land Cover**
   - Upload the `LOD` and `Land Cover` layers at any time; they do not gate other datasets but are required before computing.

4. **Unlock and Load WSS Soils**
   - The `Soil Layer from Web Soil Survey` option unlocks only after Steps 1–2 are complete (every Drainage Area and Subarea is tagged).
   - When uploading a WSS ZIP, the app trims it to the combined Drainage Area footprint before adding the layer.
   - All soil polygons arrive with a blank `HSG` field—assign `A`, `B`, `C`, or `D` manually in the map popup.

5. **Review Before Compute**
   - Confirm every layer needed for SCS calculations is present: `LOD`, `Drainage Areas`, `Drainage Subareas`, `Land Cover`, and `Soil Layer from Web Soil Survey`.
   - Spot-check logs for auto-generated complements or trimming notices before running the compute overlay.

Keep this list close to the upload logic and update both when requirements evolve.
