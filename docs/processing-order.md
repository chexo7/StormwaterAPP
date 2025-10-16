# Orden recomendado de procesamiento de capas

Este registro mantiene los pasos necesarios para que la aplicación procese correctamente los insumos. Actualízalo cada vez que cambie la secuencia requerida.

1. **Confirmar proyección del proyecto.**
2. **Cargar la capa `Drainage Areas`.**
   - Revisar cada polígono y asignar un `Discharge Point #` (DP-01 … DP-20).
3. **Cargar la capa `Drainage Subareas`.**
   - Nombrar cada subárea como `DRAINAGE AREA - #`.
   - Asociar cada subárea a uno de los `Discharge Point #` disponibles.
   - Verificar que la suma de subáreas coincida con el área total de su Drainage Area; el sistema genera subáreas complementarias cuando es necesario.
4. **Cargar la capa `LOD` y validar su geometría.**
5. **Cargar la capa `Land Cover` y asignar coberturas cuando falten.**
6. **Cargar la capa `Soil Layer from Web Soil Survey` (WSS).**
   - Disponible únicamente cuando las Drainage Areas y Subareas cumplen con los requisitos anteriores.
   - Al cargarla, los valores `HSG` se inicializan vacíos y deben asignarse manualmente (A, B, C o D).
   - La capa se recorta automáticamente para coincidir con la envolvente exterior de las `Drainage Areas`.
7. **Completar capas opcionales (Catch Basins, Pipes, etc.) según corresponda.**
8. **Ejecutar los cálculos SCS y validar resultados.**
9. **Preparar exportaciones (HydroCAD, SWMM, shapefiles) una vez finalizado el proceso.**

> Nota: Mantén este listado sincronizado con la lógica de validaciones y habilitación de capas en la interfaz.
