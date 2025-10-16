# Orden recomendado de carga y configuración

## Español
1. **Definir LOD**: carga la capa `LOD` y confirma que contiene un único polígono válido.
2. **Cargar Drainage Areas**: importa la capa general y asigna un `Discharge Point (DP-##)` único a cada polígono desde el mapa.
3. **Incorporar Drainage Subareas**: añade la capa de subáreas, nómbralas como `DRAINAGE AREA - #` y vincula cada una al `DP-##` correspondiente. La aplicación generará automáticamente las subáreas complementarias cuando sea necesario.
4. **Desbloquear el WSS**: una vez que todas las Drainage Areas y Subareas tengan sus DP-## asignados, carga la capa `Soil Layer from Web Soil Survey`. La aplicación recorta sus polígonos al contorno exterior de las Drainage Areas y deja el campo `HSG` vacío para que selecciones A, B, C o D manualmente.
5. **Cargar Land Cover**: agrega la capa `Land Cover` y revisa/ajusta sus valores desde el mapa.
6. **Revisar registros**: utiliza el panel de logs para asegurarte de que no queden advertencias antes de correr los cálculos.
7. **Ejecutar cálculos y exportar**: cuando todas las capas obligatorias estén listas, ejecuta el flujo de cálculos SCS y, si es necesario, exporta a HydroCAD, SWMM o nuevos shapefiles.

## English
1. **Define the LOD**: load the `LOD` layer and verify it contains a single valid polygon.
2. **Load Drainage Areas**: import the general drainage layer and assign a unique `Discharge Point (DP-##)` to every polygon from the map controls.
3. **Add Drainage Subareas**: upload the subarea layer, name each feature `DRAINAGE AREA - #`, and link it to the appropriate `DP-##`. The app will synthesize complementary subareas when required.
4. **Unlock WSS**: once every Drainage Area and Subarea carries its DP-## assignment, load the `Soil Layer from Web Soil Survey`. The app clips it to the outer boundary of the Drainage Areas and leaves the `HSG` field blank so you can select A, B, C, or D manually.
5. **Load Land Cover**: add the `Land Cover` layer and review/adjust its values directly from the map.
6. **Review the log**: confirm there are no outstanding warnings before running computations.
7. **Run computations and export**: when all required layers are ready, execute the SCS computation flow and export to HydroCAD, SWMM, or new shapefiles as needed.
