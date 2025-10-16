# Stormwater Data Preparation Order

Esta aplicación asume un flujo de trabajo específico para que los cálculos hidrológicos se mantengan consistentes entre las fases de pre y post desarrollo. Usa esta lista como referencia cuando revises o refactorices el código.

1. **Cargar Drainage Areas (`DA-TO-DP.zip`)**.
   - Revisa que cada polígono represente un área tributaria a un Discharge Point.
   - Asigna un "Discharge Point #" a cada polígono utilizando el desplegable del mapa (se formatea internamente como `DP-##`).
2. **Cargar Drainage Subareas (`SUB-DA.zip`)**.
   - Solo se permite cuando todas las Drainage Areas tienen un `DP-##` válido.
   - Cambia el nombre de cada subárea a `DRAINAGE AREA - #` y vincúlala a uno de los `DP-##` disponibles.
   - El sistema genera automáticamente un polígono complementario para cada `DP-##` si las subáreas no cubren toda el área mayor.
3. **Validar asociaciones entre Drainage Areas y Subareas**.
   - Antes de continuar debes confirmar que no existan subáreas huérfanas o sin `DP-##`.
4. **Habilitar la carga de la capa Soil Layer from Web Soil Survey (WSS)**.
   - Esta capa se desbloquea cuando las dos etapas anteriores están completas.
   - Al incorporarla, cada polígono se recorta a la envolvente exterior combinada de las Drainage Areas.
   - Los campos `HSG` se inicializan en blanco para que el usuario seleccione manualmente `A`, `B`, `C` o `D` en el mapa.
5. **Cargar Land Cover y LOD** (en cualquier orden tras completar los pasos anteriores).
6. **Ejecutar los cálculos SCS** cuando todas las capas requeridas estén listas.

Mantén este documento actualizado si cambian los prerequisitos o la lógica de validación para asegurar que el flujo se conserve sincronizado con el código.
