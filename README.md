# StormwaterAPP

instrucciones para desarrollarla

"Guía de Diseño de Aplicación Web para Modelos de
Stormwater
Paso 1: Definición de Requisitos y Alcance
El objetivo es diseñar una aplicación web que permita generar múltiples modelos de drenaje pluvial
(stormwater) a partir de la intersección de distintos archivos geoespaciales (shapefiles). La aplicación debe
superponer datos de suelos (incluyendo el Grupo Hidrológico de Suelo, HSG, obtenido por ejemplo del Web
Soil Survey), cobertura de suelo (land cover o uso de suelo) y áreas de drenaje para calcular parámetros
hidrológicos mediante el método SCS (Soil Conservation Service) . En particular, se busca calcular el
Número de Curva (Curve Number, CN) de SCS para cada área de drenaje, a partir de la combinación de
tipo de cobertura y tipo de suelo . Con estos resultados, la herramienta debe preparar los datos para
exportarlos a software de modelación reconocidos en ingeniería hidráulica: PCSWMM, SewerGEMS y
HydroCAD. La aplicación será de uso interno (como ingeniero civil la usaré yo y potencialmente mi equipo)
y empleará la API de Google Maps para el mapa base interactivo.
Resumen de funciones requeridas:
Carga de múltiples shapefiles (suelos, uso de suelo, cuencas u otras áreas de drenaje) y
visualización de estos datos geográficos sobre un mapa base (Google Maps).
Manejo de proyecciones geográficas: reproyectar los shapefiles a coordenadas compatibles con
Google Maps (WGS84) para que se alineen correctamente .
Herramientas para editar los polígonos de los shapefiles dentro de la aplicación (p. ej., ajustar
límites de cuencas o áreas directamente en el mapa). Google Maps API permite incorporar formas
editables por el usuario , lo cual se aprovechará.
Procesamiento geoespacial: intersección de capas de información (suelos vs. cobertura) y cálculo
de parámetros hidrológicos (ej. CN del método SCS) en base a esas intersecciones. Esto implica
combinar atributos de HSG y tipo de cobertura para asignar números de curva según tablas SCS
y obtener valores agregados por cada área de drenaje.
Exportación de resultados en formatos compatibles con PCSWMM, SewerGEMS y HydroCAD, o en
formatos que estos softwares puedan importar fácilmente (por ejemplo, shapefiles con atributos
específicos, archivos de intercambio, o archivos de entrada como .inp para SWMM). La aplicación
debe preparar los datos de modo que se puedan usar los asistentes de importación (import wizards)
o funciones integradas de cada software destino para incorporar la información sin mayor dificultad.
Paso 2: Selección de Tecnologías y Decisiones de Diseño
Para lograr las funciones anteriores sin una implementación excesivamente compleja, se optará por una
arquitectura web moderna con tecnologías bien soportadas:
Backend (servidor): Se utilizará Node.js por su robustez manejando E/S de archivos y porque se
puede desplegar fácilmente en Vercel (que soporta funciones serverless en Node). Node.js permitirá
1
1
•
•
2
•
3
•
1
•
•
1
procesar los shapefiles (lectura y cómputo de intersecciones) en el servidor si es necesario. Un
framework opcional podría ser Express (para crear API REST) o incluso Next.js si se prefiere
combinar frontend y backend en un solo proyecto (Next.js funciona bien con Vercel). La elección de
Node también facilita el uso de bibliotecas JavaScript para tareas geoespaciales.
Frontend (cliente): Se empleará HTML/JavaScript estándar o un framework web (como React con
Next.js) para construir la interfaz de usuario. Dado que la app requiere interacción pesada con
mapas y archivos, usar React podría ayudar en la gestión del estado de la aplicación; sin embargo,
también podría implementarse con JavaScript nativo o con librerías ligeras si se desea simplicidad.
Lo importante es que el frontend cargará la API de Google Maps y manejará las interacciones del
usuario.
Mapa e Interacción Geográfica: Se usará la Google Maps JavaScript API como mapa base. Esta
API proporciona mapas mundialmente conocidos y herramientas listas para dibujar y editar formas
geoespaciales. En particular, Google Maps permite agregar polígonos editables sobre el mapa (por
ejemplo, se puede crear un rectángulo o polígono con la propiedad editable: true para que el
usuario pueda mover sus vértices) . Además, la API maneja internamente la proyección Web
Mercator (EPSG:3857) basada en WGS84 , por lo que nuestros datos deben transformarse a
latitud/longitud geográficas antes de mostrarlos.
Lectura y manejo de Shapefiles: Trabajar con shapefiles en un entorno web requiere convertirlos a
un formato web-friendly, típicamente GeoJSON. Optaremos por utilizar librerías JavaScript existentes
para esta conversión en lugar de desarrollar desde cero. Una opción es shp.js (Shapefile.js), una
librería pura de JS que puede leer archivos .shp (junto con .dbf, .shx) y producir objetos GeoJSON ya
proyectados en WGS84 . Según su documentación, shapefile-js puede usarse tanto en Node
como en el navegador, y entrega GeoJSON listo para mapas . Esto simplifica la reproyección,
siempre y cuando el shapefile incluya su archivo .prj con la referencia espacial. De no ser así,
podríamos integrar Proj4js para convertir coordenadas manualmente definiendo los EPSG
apropiados. Otra alternativa es procesar shapefiles en el backend usando paquetes de Node como
shapefile de Mike Bostock o ginkgoch-shapefile, pero la conversión a GeoJSON seguiría siendo el
objetivo final.
Bibliotecas de Análisis Geoespacial: Para realizar la intersección de polígonos y cálculos de área
usaremos Turf.js, una popular librería geoespacial para JavaScript. Turf provee funciones como
turf.intersect para obtener la intersección de dos polígonos , así como turf.area para
calcular el área de un polígono GeoJSON (calculando el área geodésica en metros cuadrados) .
Estas herramientas nos permitirán, por ejemplo, intersectar un polígono de suelo con uno de uso de
suelo y obtener la porción común, o calcular el área de esas porciones comunes. Turf funciona en el
navegador y en Node, por lo que podemos decidir hacer este procesamiento en el cliente
(distribuyendo la carga al usuario) o en el servidor (más control, a costa de más uso de CPU en el
backend). Dado que se busca que la implementación no sea extremadamente compleja, se puede
empezar realizando los cálculos en el backend Node (donde Vercel puede escalar si es necesario),
para simplificar la lógica en el cliente.
Almacenamiento y Estado: Inicialmente, no se requiere una base de datos persistente, ya que la
aplicación operará de forma stateless por proyecto: el usuario carga los archivos, obtiene resultados
y descarga archivos de salida. Todo esto puede ocurrir en la sesión del navegador sin necesidad de
•
•
3
4
•
2
5
6
•
7
8
•
2
guardar datos en un servidor. Sin embargo, si más adelante se quiere guardar configuraciones de
proyectos o resultados, se podría añadir una base de datos ligera (por ejemplo, SQLite o un servicio
cloud de JSON) o simplemente manejar archivos temporales.
Asistencia de Inteligencia Artificial en Desarrollo: Dado que la implementación se plantea con
“vibe coding” asistido por IA, se aprovecharán herramientas como GitHub Copilot o asistentes de
código basados en GPT para acelerar el desarrollo. Esto ayudará a generar componentes repetitivos
(por ejemplo, código de lectura de shapefile o plantillas para la interfaz de Google Maps) de forma
más rápida y con menos errores. La IA también puede servir para sugerir cómo usar las APIs
correctamente (como la sintaxis de Turf.js o Google Maps), complementando la investigación
manual. La idea es mantener la calidad y coherencia del código usando estas herramientas, sin
descuidar las buenas prácticas.
En resumen, la elección tecnológica se centra en JavaScript/TypeScript full-stack (Node.js + Google Maps
API + librerías JS especializadas), lo que permite implementar todo en un mismo lenguaje. Esto hará más
fácil iterar en la funcionalidad apoyándonos en el ecosistema GIS de JavaScript y desplegar la solución en la
nube (Vercel) de forma sencilla.
Paso 3: Diseño de la Interfaz Web (Front-end con Google Maps)
En la interfaz de usuario, el componente principal será un visor de mapa interactivo apoyado en Google
Maps, complementado con controles para gestionar archivos y capas. El diseño debe ser intuitivo para un
usuario técnico (ingeniero) pero no necesariamente experto en SIG. A continuación se describen los
elementos UI clave:
Mapa Base: Ocupa la mayor parte de la pantalla, utilizando la API de Google Maps centrada
inicialmente en una vista general o en la zona de interés del proyecto. Sobre este mapa se podrán
superponer capas vectoriales (polígonos de los shapefiles cargados). Google Maps se encargará de
mostrar el terreno, calles, etc., facilitando la orientación espacial del usuario. Los polígonos de
suelos, uso de suelo y cuencas se dibujarán con estilos semitransparentes y colores diferenciados
para distinguir cada capa.
Control de Carga de Archivos: Se proporcionará un botón o área de drag & drop para subir
shapefiles. Dado que un shapefile consiste en varios archivos, probablemente pediremos que el
usuario cargue un archivo .zip que contenga .shp, .dbf, .shx (y .prj si existe). Al subir el zip, el
frontend (o backend) lo descomprimirá y procesará. El UI debe indicar claramente qué tipo de
shapefile se espera en cada caso (por ejemplo, un botón para "Cargar Shapefile de Suelos", otro para
"Cargar Cobertura de Suelo", etc., o un gestor de capas que permita múltiples). Alternativamente, se
podría detectar automáticamente el contenido por atributos conocidos (ej. si el shapefile tiene
campo de HSG, asumir que es suelos).
Lista de Capas y Leyenda: Una vez cargadas, cada capa (suelos, cobertura, cuencas) aparecerá en
un panel lateral con opciones: mostrar/ocultar la capa, cambiar simbología básica (colores/
transparencia) si necesario, y posiblemente mostrar una leyenda de categorías (por ejemplo, colores
por tipo de cobertura). Este panel de capas ayudará a verificar visualmente que los datos cargados
son correctos.
•
•
•
•
3
Edición de Geometrías: La aplicación permitirá editar polígonos directamente en el mapa. Por
ejemplo, si tras cargar un shapefile de cuencas el usuario quiere ajustar manualmente alguna
frontera, podrá seleccionar ese polígono y modificar sus vértices. Gracias a Google Maps API, es
sencillo activar la edición: al crear un google.maps.Polygon , podemos establecer
polygon.setEditable(true) para hacerlo arrastrable . Incluso existe la librería de Drawing
Tools de Google Maps que provee controles para dibujar nuevas figuras o editar existentes. En este
diseño, incorporaremos un modo de edición: el usuario podría hacer clic en un botón "Editar capa X"
y entonces todos los polígonos de esa capa se vuelven editables (o quizás se duplica la capa a un
estado editable). Los cambios realizados (coordenadas movidas) deben reflejarse en los datos
GeoJSON de la capa para que luego el cálculo SCS use la geometría actualizada. Esta funcionalidad
es crucial para refinar áreas de drenaje manualmente sin recurrir a software GIS externo.
Botón de Cálculo / Procesamiento: Una vez que las capas necesarias estén cargadas y ajustadas,
habrá un botón tipo "Calcular modelo SCS" o "Generar Parámetros". Al activarlo, la app ejecutará la
lógica de intersección y cálculo (Paso 5) y luego mostrará los resultados. Los resultados podrían ser
mostrados en una tabla en el propio frontend (por ejemplo, una lista de cuencas con su área y CN
calculado), para revisión inmediata. También desde aquí se ofrecerán las opciones de exportación a
los diferentes formatos de software.
Opciones de Exportación: El UI deberá permitir elegir el formato de salida para cada software
destino. Esto podría ser mediante tres botones: "Exportar PCSWMM", "Exportar SewerGEMS",
"Exportar HydroCAD". Al hacer clic, se genera el archivo correspondiente (o un paquete de archivos)
y se descarga al computador del usuario. Podría también mostrarse un breve mensaje indicando
qué hacer con ese archivo (por ejemplo, "Importe este archivo .inp en PCSWMM" o "Abra este CSV en
HydroCAD").
Experiencia de Usuario: Puesto que la aplicación es interna pero potencialmente usada por varios
colegas, se busca que la interfaz sea clara. Se mantendrán indicaciones contextuales (tooltips o
textos cortos) para guiar el flujo: por ejemplo, una vez cargadas las capas, un mensaje podría sugerir
"Revise la superposición de capas en el mapa. Si es necesario, edite las geometrías antes de
calcular.". Tras el cálculo, podría haber mensajes confirmando la generación de resultados.
En síntesis, el front-end combinará el mapa interactivo de Google (para visualización y edición geoespacial)
con controles de usuario para gestionar los datos y resultados. Este diseño enfatiza la visualización directa
de las capas superpuestas, lo que ayuda a validar que el cruce de datos (suelos vs cobertura vs cuenca) es
correcto antes de exportar. Además, al basarse en Google Maps, nos aseguramos de contar con un entorno
familiar y capacidades fluidas de navegación (zoom, paneo) y edición básica sin tener que codificar toda la
manipulación de geometrías desde cero.
•
3
•
•
•
4
Paso 4: Carga y Procesamiento de Shapefiles (Back-end y
Reproyecciones)
Una vez que el usuario carga los shapefiles (mediante el UI del paso 3), la aplicación debe leer esos
archivos, extraer sus geometrías y atributos, y prepararlos para el cálculo. Aquí detallamos el flujo técnico:
Subida de Archivos: Cuando el usuario sube un .zip de shapefile, el navegador lo enviará al servidor
(o lo procesará localmente). Optaremos por enviar al backend Node.js para aprovechar librerías
robustas y evitar limitaciones de memoria en el navegador si los archivos son pesados. En el
backend, usaremos un módulo como adm-zip o similar para descomprimir el .zip en memoria (en
Vercel los sistemas de archivos son temporales, pero para un solo request se puede manejar en
memoria). Obtendremos los streams o buffers de .shp, .dbf, .shx, etc.
Lectura a GeoJSON: Utilizaremos una biblioteca Node para leer el shapefile. Por ejemplo, el paquete
shapefile de Mike Bostock permite cargar un shapefile completo y obtener un GeoJSON
FeatureCollection en una sola llamada . Alternativamente, podríamos integrar la mencionada
shp.js en Node (está disponible via npm como shpjs o shp-to-geojson ). Esta conversión es
fundamental: obtendremos por cada shapefile una estructura de datos en JSON con todas las
features (polígonos) y sus atributos. Cabe destacar que shapefile-js típicamente proyecta
automáticamente las coordenadas a WGS84 (lat/lon) si el .prj es reconocido , lo que nos ahorra
pasos de reproyección. De todas formas, validaremos que la geometría resultante esté en latitud/
longitud. Si no, aplicaremos manualmente Proj4: por ejemplo, muchos shapefiles locales pueden
venir en coordenadas UTM o sistemas locales; en tal caso leeríamos el EPSG del .prj y
transformaríamos cada coordenada al sistema del mapa (EPSG:4326).
Manejo de Proyecciones: Es crítico asegurar que todas las capas estén en la misma proyección al
realizar intersecciones. Convertiremos todo a WGS84 (coordenadas geográficas) ya que Google
Maps y Turf.js pueden trabajar directamente en lat/lon. Aunque Turf calcula áreas geodésicas
correctamente en lat/lon , en ciertos casos podríamos considerar proyectar a un sistema planar
(como UTM correspondiente) para cálculos de área más precisos en zonas muy grandes. Sin
embargo, dado que las cuencas posiblemente sean locales, turf.area con geodesia será
suficientemente preciso. En cualquier caso, documentaremos que el sistema de salida es WGS84
para evitar confusiones.
Estructura de Datos Interna: Después de la lectura, tendremos en el backend, por ejemplo, tres
objetos GeoJSON:
soilsGeoJSON (polígonos de suelos, con atributos incluyendo el código de HSG).
landcoverGeoJSON (polígonos de cobertura de suelo, con atributo de tipo de uso/cobertura).
drainageGeoJSON (polígonos de cuencas o áreas de drenaje, con quizás un nombre o ID).
Podemos almacenar estos objetos en memoria durante la sesión de cálculo. Si el procesamiento se
realiza inmediatamente, no es necesario persistir nada.
Edición de Features: Si el usuario realizó ediciones en el front-end antes de calcular, esas
modificaciones deben enviarse al backend. Esto podría hacerse de dos modos:
1.
2.
6
2
3.
8
4.
5.
6.
7.
8.
5
O bien, después de cada edición, actualizar en el servidor (pero eso sería complejo y lento).
Mejor: cuando el usuario haga clic en "Calcular", el front-end podría enviar no los shapefiles
originales, sino los GeoJSON actualizados de cada capa (Google Maps API permite obtener las
coordenadas editadas de los polígonos). Así, el backend recibiría directamente GeoJSON de suelos,
cobertura y cuencas listos para procesar, omitiendo incluso la necesidad de leer shapefile
nuevamente. Esta aproximación descarga trabajo del servidor en casos de ediciones. Para simplificar,
podríamos implementar primero sin edición (tomando shapefile original), y luego agregar la opción
de que el front-end reemplace geometrías con las editadas.
Verificación de Datos: El backend puede realizar chequeos rápidos, por ejemplo: asegurar que los
shapefiles de suelo y cobertura cubren, al menos en su totalidad, las áreas de drenaje
proporcionadas (si alguna cuenca queda fuera de la zona de solape de las otras capas, avisar al
usuario). También se podría validar que existan los campos esperados: ej. en suelos que haya un
campo "HSG" o similar, en cobertura un campo de clasificación de uso (usaremos el nombre real del
campo según los datos de entrada; quizá requiera configuración por parte del usuario, a menos que
asumamos datasets estándar). Para esta guía, asumimos que identificaremos los campos
manualmente o con heurísticas (por ejemplo, buscar "HSG" en la tabla de atributos de suelos, o usar
documentación del origen de datos).
En resumen, este paso prepara los datos en un formato unificado (GeoJSON) y en un sistema de
coordenadas común (WGS84). Con esto, allanamos el camino para el análisis geoespacial del siguiente
paso. Vale destacar que todo este proceso se apoyará en bibliotecas existentes para minimizar errores y
esfuerzos: no parsearemos archivos binarios a mano, sino que reutilizaremos componentes probados .
Así mantenemos la implementación elaborada pero manejable.
Paso 5: Cálculo de Parámetros Hidrológicos mediante Intersección
de Capas (Método SCS)
Con las capas geo-espaciales en formato utilizable, pasamos al núcleo de la lógica de negocio: combinar
la información de suelos y uso de suelo para calcular parámetros hidrológicos de cada área de drenaje
según el método SCS. El proceso detallado será:
Intersección Suelo-Cobertura: Primero, necesitamos conocer para cada lugar de la zona de estudio
qué combinación de tipo de suelo (HSG) y tipo de cobertura existe. Para ello, realizaremos una
intersección geoespacial entre las capas de suelos y cobertura. Básicamente, se traslapan los
polígonos de la capa de suelos con los de la capa de uso de suelo, generando polígonos más
pequeños que heredan atributos de ambas capas. Cada polígono resultante representará una área
homogénea en cuanto a HSG y cobertura. Por ejemplo, si un polígono de suelo (HSG A) cubre
parcialmente un polígono de cobertura "Bosque", el área donde se traslapan será un nuevo polígono
con atributos {HSG=A, cobertura=Bosque}. Usando Turf.js, podemos iterar por cada polígono de
suelos y dentro de eso por cada polígono de cobertura y aplicar
turf.intersect(poligono_suelo, poligono_cobertura) . Esto dará los polígonos de
intersección (o null si no hay solape). Esto es computacionalmente intensivo si hay muchísimos
polígonos, pero asumimos un tamaño manejable de datos. (Si el desempeño fuera un problema, una
alternativa sería usar una librería optimizada en C++ vía WebAssembly, o una estructura espacial,
pero inicialmente Turf debe bastar).
9.
10.
11.
5
1.
7
6
Asignación de Número de Curva (CN): Por cada polígono resultante de la intersección anterior,
determinaremos su Curve Number correspondiente. Para ello, necesitamos una tabla de
referencia SCS que provea el CN en función de HSG y tipo de cobertura. Estas tablas son estándar;
por ejemplo, TR-55 del NRCS contiene valores de CN para combinaciones de uso de suelo (bosque,
pasto, urbano, etc.) y grupos de suelo A, B, C, D . Incluiríamos en el código una estructura
(objeto o matriz) con estos valores. Por ejemplo: CN_table[cobertura]["A"] = 30, ... etc.,
dependiendo del nivel de detalle (usaríamos la condición hidrológica "normal" o promedio). Si el tipo
de cobertura en el shapefile es algo como códigos NLCD (National Land Cover Database) o
categorías personalizadas, habría que mapear esas categorías a la tabla SCS adecuada. Podríamos
empezar manejando algunas clases típicas (bosque, urbano, agrícola, pasto) y extender si es
necesario. Una vez tengamos la tabla, a cada polígono intersección le asignamos un atributo nuevo
CN = CN(HSG, cobertura). Por ejemplo, si la intersección es {HSG: B, cobertura: "Residential"} y la
tabla dice para Residencial B el CN es 75, se asigna CN=75 .
Intersección con Áreas de Drenaje: Ahora tomamos cada polígono de cuenca/área de drenaje y
determinamos cuánto de cada segmento de suelo-cobertura cae dentro. Esto implica otra serie de
intersecciones: por cada cuenca y por cada polígono de la lista obtenida en el paso 1 (que tiene CN
asignado), calculamos la intersección (si existe) con la cuenca. En efecto, estamos cortando los
polígonos de suelo-cobertura usando los polígonos de las cuencas como límites. Así obtenemos,
para cada cuenca, múltiples sub-porciones, cada una con un CN (y sabemos su área). Podemos de
nuevo usar turf.intersect(cuenca, poligono_interseccion) para cada combinación. Para
optimizar, podríamos primero hacer un filtro rápido por bounding box o usar Turf.js
turf.booleanIntersects para evitar calcular intersecciones inútiles.
Cálculo de CN Compuesto: Una vez obtenidas todas las porciones dentro de una cuenca,
calculamos el Número de Curva Compuesto de la cuenca. La fórmula típica para CN compuesto es
una media ponderada por área: $$CN_{comp} = \frac{\sum (CN_i \cdot A_i)}{\sum A_i},$$ donde
$CN_i$ es el número de curva de la i-ésima porción y $A_i$ su área. Dado que nuestras cuencas
pueden tener distintos tamaños, comprobaremos que $\sum A_i$ efectivamente coincide con el área
total de la cuenca (Turf puede recalcular el área de la cuenca como control). Usando turf.area()
obtenemos cada área en metros cuadrados (u otra unidad consistente). Realizamos la sumatoria
para cada cuenca. El resultado principal para cada cuenca será este CN promedio ponderado.
Además, podríamos calcular otros valores si hacen falta para los modelos: por ejemplo, el área total
de la cuenca (lo cual es trivial al sumar $A_i$), quizás un coeficiente de runoff o Curve Number bajo
distintas condiciones de humedad (en general CN se refiere a condición II; los modelos pueden
requerir CN para condiciones I y III, pero eso puede derivarse aproximadamente o dejarse fijo).
Inicialmente nos enfocaremos en CN condición II que es lo típico.
Otros Parámetros Hidrológicos: El método SCS completo para generar hidrogramas requeriría
además el Tiempo de Concentración (Tc) de la cuenca y posiblemente la pendiente promedio. Estos
no se derivan directamente de la intersección de suelo y cobertura. Si la aplicación busca completar
datos para PCSWMM/SewerGEMS/HydroCAD, habría que considerar cómo obtenerlos:
Tc: Podría ser ingresado manualmente por el usuario para cada cuenca, o calculado con alguna
fórmula empírica usando la geometría (por ej., longitud del flujo más largo y pendiente). Una
implementación avanzada podría usar el shapefile de cuencas junto con un DEM (modelo de
elevación) para calcular Tc, pero eso escapa a nuestro alcance actual. En esta guía asumiremos que
2.
1 9
10
3.
4.
8
5.
6.
7
Tc no se calcula automáticamente (o asignamos un valor default y permitimos editarlo antes de
exportar, si necesario).
Área permeable/impermeable: A veces los modelos como SewerGEMS representan cada cuenca con
porcentajes de área impermeable. Dado que ya tenemos cobertura detallada, podríamos derivar el
% de área impermeable sumando las porciones cuyo uso de suelo sea urbano impermeable (tejados,
calles). Esto es factible y puede ser un valor a exportar. Sin embargo, como CN ya encapsula la
combinación de suelo e impermeabilidad, podría no hacer falta separar.
Parámetros SCS adicionales: Por ejemplo, la capacidad máxima de almacenamiento (S) o la
abstracción inicial (Ia) pueden ser calculadas a partir de CN (S = (25400/CN) - 254 en unidades
métricas aproximadamente). Estos valores podrían ser incluidos en la exportación según requiera
cada software (algunos piden CN, otros piden S directamente).
En este paso de cálculo nos apoyamos fuertemente en funciones GIS ya existentes para asegurar exactitud.
Cada intersección se hace con Turf y cada área con Turf, garantizando consistencia en las unidades (metros
cuadrados). La lógica SCS es validada contra las tablas oficiales para evitar errores en CN. Al terminar,
tendremos para cada cuenca un conjunto de atributos listo para exportar, incluyendo: área, CN compuesto,
quizás desglose de porcentajes de cada tipo de cobertura (si quisiéramos reportar eso para transparencia),
etc. Estos resultados también pueden presentarse en pantalla al usuario para revisión, antes de proceder a
la exportación.
Paso 6: Exportación de Resultados a PCSWMM, SewerGEMS y
HydroCAD
El último paso es traducir los resultados obtenidos en formatos que puedan ser utilizados directamente o
importados fácilmente por los tres programas de destino. Cada software tiene sus rutinas de importación
o formatos preferidos, investigados a continuación, y adaptaremos la salida de nuestra aplicación a esas
especificaciones:
Exportación a PCSWMM (SWMM5): PCSWMM es una interfaz avanzada para el modelo EPA
SWMM5, y soporta importación de datos GIS para construir modelos. Una estrategia es generar un
archivo de entrada SWMM (.inp) completo con las subcuencas definidas. El .inp de SWMM tiene
secciones de texto, entre ellas [SUBCATCHMENTS] (con atributos como área, porcentaje
impermeable, pendiente, etc.), [INFILTRATION] (si se usa el método de infiltración SCS Curve
Number, esta sección daría el CN) y una sección [POLYGONS] que lista vértices de cada polígono de
subcuenca . Nuestra app podría ensamblar un .inp mínimo: incluir cada cuenca como una
subcatchment con su área calculada y CN (si usamos el método de infiltración "Curve Number" de
SWMM) . Los vértices de cada polígono se podrían extraer de la geometría (convertidos a
coordenadas planas; SWMM no conoce proyecciones geográficas, pero PCSWMM permite usarlas
para visualización). Esta aproximación permitiría al usuario abrir directamente el .inp en PCSWMM y
tener las subcuencas ya delineadas en el lugar correcto.
Otra opción es exportar shapefiles específicos para PCSWMM: por ejemplo, un shapefile de subcuencas
con atributos en la tabla (área, CN, nombre de subcuenca). PCSWMM incluye un wizard de importación GIS/
CAD que permite al usuario mapear campos de un shapefile a propiedades del modelo . Por ejemplo, se
podría usar un shapefile de polígonos para subcuencas; PCSWMM detectará los polígonos y puede calcular
sus áreas y asignarles identificadores . Luego, a través del asistente, se pueden asignar campos como
CN a las propiedades de infiltración de esas subcuencas. De hecho, existen herramientas y complementos
7.
8.
9
•
11
11
12
12
8
(como SWMM5 to SHP de LAGO Consulting) que hacen este intercambio bidireccional . En nuestro
caso, generar directamente el .inp podría ser más automático y menos propenso a error del usuario. Por lo
tanto, implementaremos la generación de un archivo .inp con: - Coordenadas de polígonos (tomadas de
GeoJSON de cada cuenca, convertidas a pares X-Y; podemos usar lat y lon como X Y, asumiendo que
PCSWMM los interpretará simplemente como coordenadas para el mapa). - Área de subcuenca (PCSWMM
puede recalcularla de los polígonos, pero la incluiremos por consistencia). - Método de infiltración SCS
Curve Number con el CN compuesto que calculamos. - Valores por defecto o estimados para otros campos
obligatorios (por ejemplo, pendiente de la cuenca, ancho, etc., si no los tenemos, podríamos asignar un
ancho representativo proporcional al área, y una pendiente genérica o preguntar al usuario).
Esta capacidad de importar shapefiles o .inp ahorrará muchísimo tiempo en PCSWMM, ya que
manualmente cargar 100 subcuencas sería tedioso. Nuestra investigación confirma que es posible construir
modelos SWMM a partir de shapefiles de subcuencas , y también que no todos los parámetros se
pueden transferir automáticamente (al importar desde GIS, ciertos datos podrían requerir ajuste manual)
. Por ello, nos enfocamos en lo esencial (geometría y CN). Una vez el .inp esté generado, el usuario
podrá abrirlo en PCSWMM y verificar que cada subcuenca tiene su área y CN asignado.
Exportación a SewerGEMS (Bentley OpenFlows): SewerGEMS (y su variante CivilStorm) trabaja con
modelos que pueden construirse mediante su ModelBuilder, el cual admite fuentes de datos
externas como shapefiles y tablas . Para importar nuestras cuencas y parámetros en SewerGEMS
existen un par de enfoques:
Vía Shapefile de Cuencas: Generaremos un shapefile (o GeoJSON, aunque SewerGEMS preferirá
shapefile) de las subcuencas. Cada polígono representará una cuenca, con atributos en la tabla, por
ejemplo: Name (nombre o ID), Area (en la unidad que requiera, SewerGEMS puede calcular área
automáticamente pero incluiremos el valor), y si es posible CN o datos de infiltración. SewerGEMS
permite importar polígonos como elementos Catchment mediante ModelBuilder, mapeando
columnas del shapefile a propiedades del modelo (por ejemplo, mapeas la columna Area a la
propiedad "Area" de la cuenca, etc.). Las guías de ModelBuilder indican que soporta formatos GIS
como shapefiles, geodatabases, Excel, etc . Entonces, el usuario en SewerGEMS iniciaría
ModelBuilder, seleccionaría nuestro shapefile como origen, elegiría tipo de elemento "Catchment" y
asociaría los campos. Podemos automatizar parte creando el shapefile con nombres de campo que
coincidan con los esperados por SewerGEMS (por ejemplo, "Area (User)" para área, aunque
SewerGEMS usualmente recalcula área de la geometría). Lo más importante es posiblemente el
campo de Outflow Node (a qué nodo de la red se conecta cada cuenca). Dado que nuestra app no
maneja la red de alcantarillado (solo subcuencas), podríamos dejar ese campo vacío o como un
identificador que el usuario luego vincule manualmente en SewerGEMS.
Vía Distribución de Usos de Suelo: SewerGEMS tiene la opción de manejar Land Uses asociados a
cada cuenca, similar a SWMM Extensions. Es decir, en lugar de un solo CN promedio, el software
puede almacenar qué porcentaje de la cuenca es bosque, qué porcentaje es urbano, etc., y calcular
un CN internamente . Si quisiéramos aprovechar esto, nuestra aplicación podría exportar un
archivo Excel (o CSV) listando para cada cuenca su desglose por uso de suelo. Por ejemplo:
columnas: Catchment ID, LandUseType, Percent. Cada cuenca tendría múltiples filas (una por
LandUseType presente), sumando 100%. Este es exactamente el formato que SewerGEMS acepta en
ModelBuilder para importar Catchment Land Uses . De hecho, Bentley recomienda ese
método: cargar las cuencas (geometría) primero, definir las categorías de Land Use en el modelo (p.
13 14
12
14
•
15
•
15
•
16
16 17
9
ej., crear entradas "Bosque", "Urbano" con sus CNs), luego importar vía ModelBuilder el reparto
porcentual . Sin embargo, este camino es más complejo para el usuario final (requiere pasos
adicionales en SewerGEMS). Para simplificar inicialmente, podríamos optar por el enfoque de CN
único por cuenca: es decir, calcular el CN compuesto y simplemente asignarlo. SewerGEMS permite
asignar un CN a la cuenca si elegimos el método de infiltración SCS en sus propiedades. Entonces,
en el shapefile de cuencas podríamos incluir un campo "CurveNumber" con el valor que calculamos,
y al importarlo, mapear ese campo a la propiedad CN de la cuenca en ModelBuilder. Esto debería
directamente configurar la cuenca con ese CN (SewerGEMS llamaría internamente al mismo motor
SCS para producir la abstracción).
En conclusión, para SewerGEMS proveeremos dos archivos: un shapefile de cuencas con atributos básicos
(Area, CN, Name) y un archivo tabular (CSV/Excel) con los porcentajes de usos de suelo por cuenca. El
usuario podrá usar ModelBuilder para importar el shapefile de cuencas primero (creando los elementos
espaciales) y luego usar ModelBuilder de nuevo para importar el archivo de porcentajes vinculando por el
nombre de cuenca . Esta doble opción cubre tanto un uso rápido (solo CN) como uno detallado (land use
distribution) según la preferencia del ingeniero.
Exportación a HydroCAD: HydroCAD es algo distinto, ya que es más un programa de cálculo
hidrológico conceptual que GIS. HydroCAD no maneja shapefiles directamente, pero sí tiene
capacidades de importación de datos tabulares y desde CAD. Nuestra investigación muestra que
HydroCAD 10 permite importar datos completos de cuencas en formato CSV (valores separados
por comas) . La idea es que uno puede preparar un archivo CSV con columnas como:
Subcatchment Name, Area, Curve Number, Time of Concentration, etc., y luego en HydroCAD usar
Project > Import > Subcatchments para leer esos datos . Por lo tanto, implementaremos la
generación de un archivo CSV con las columnas necesarias. Seguramente incluiremos:
Name o ID de la cuenca (HydroCAD identifica cada subcuenca por un número o nombre único).
Area (en acres o hectares según se configure HydroCAD; posiblemente lo pondremos en acres que
es común en HydroCAD US, o podríamos dar opción).
Curve Number (CN compuesto).
Tc (tiempo de concentración, si disponemos; si no, podemos dejar un valor placeholder que el
usuario edite luego en HydroCAD).
Otras posibles columnas: Impervious Percentage (si se quisiese dar ese dato), pero HydroCAD
realmente solo necesita CN si se usa SCS. Este CSV, al ser importado, creará las subcuencas en un
proyecto HydroCAD automáticamente . Cabe mencionar que HydroCAD también ofrece una
importación más automatizada desde dibujos de AutoCAD por capas (donde se mapean layers de
suelo y cobertura a subáreas) , pero eso requiere que el usuario tenga los datos en CAD. Nuestra
herramienta evita ese paso al hacer ya el cómputo. No obstante, la salida CSV se alinea con la
funcionalidad de Tabular Data Import de HydroCAD , lo que permite incluso re-importar si hay
cambios (HydroCAD soporta actualizaciones con un click si se configura un archivo de import fijo)
.
Adicionalmente, podríamos generar un breve informe para el usuario indicando cómo realizar la
importación en HydroCAD: básicamente abrir o crear un proyecto, luego Import Subcatchments con el CSV
, y HydroCAD asignará automáticamente los valores. Dado que HydroCAD no utiliza coordenadas
geoespaciales para colocar subcuencas (todo es conceptual en su diagrama), no nos preocupamos de la
forma de la cuenca, solo de sus parámetros.
17
17
•
18
19
•
•
•
•
•
20
21
18
22
19
10
En resumen, cada exportación está personalizada al flujo de trabajo de cada software:
PCSWMM: archivo .inp SWMM listo para abrir (o shapefile, pero preferimos .inp para automatizar).
SewerGEMS: shapefile de cuencas + (opcional) CSV de distribución de usos. Aprovechando
ModelBuilder que soporta shapefiles GIS y tablas externas , la importación será guiada por el
asistente de SewerGEMS.
HydroCAD: archivo CSV de subcuencas (nombre, área, CN, Tc), directamente importable en la
herramienta de import tabular .
Todos estos archivos se generarán dinámicamente cuando el usuario lo solicite, utilizando los datos
calculados en el paso 5. Generar un CSV o un texto .inp es relativamente sencillo (basta con formatear
cadenas); generar un shapefile desde Node requiere quizá usar una librería (podríamos usar shp-write en
JS para crear shapefiles en el navegador, o en Node usar algo como ginkgoch-shapefile para escribir). Dado
que Vercel puede manejar generar un archivo y luego enviarlo, optaremos por librerías JS de escritura de
shapefile para consistencia. Por simplicidad, podríamos alternativamente exportar GeoJSON y pedir al
usuario que lo convierta a shapefile en GIS, pero preferimos automatizarlo si es posible.
Cada export va acompañado de indicaciones para el usuario sobre qué hacer en el software destino, pero
esas indicaciones pueden ser incluidas en la documentación de la herramienta más que en la interfaz
misma. Lo importante es que hemos alineado nuestro formato de salida con lo que cada software espera
en sus asistentes de importación , facilitando la integración de los resultados en sus modelos.
Paso 7: Implementación, Pruebas y Despliegue en Vercel
Con el diseño conceptual y las decisiones tecnológicas tomadas, el siguiente paso es la implementación
práctica de la aplicación y su posterior despliegue. Este proyecto se beneficiará de una implementación
iterativa, probando cada módulo por separado:
Configuración del Proyecto Node.js: Iniciaremos un nuevo proyecto Node (por ejemplo, usando
npm init o con un boilerplate de Next.js si optamos por esa ruta). Instalaremos las dependencias
necesarias:
Librerías de servidor (Express si usamos una API REST clásica, o aprovechando API routes de Next.js).
Librerías de geoprocesamiento y formatos: shapefile o shpjs , turf , proj4 (si es
necesaria), adm-zip para descomprimir, y posiblemente shp-write para exportar shapefiles.
Google Maps no se instala vía npm ya que es una API web; la incluiremos en el frontend via
<script> con su API key. Sin embargo, podemos usar el loader oficial ( @googlemaps/js-apiloader ) para cargarla de forma programática en el código frontend.
Herramientas de desarrollo: dado que queremos usar IA asistente de código, integraremos GitHub
Copilot en nuestro editor o utilizaremos ChatGPT para generar fragmentos. La configuración de la
estructura de datos y algunas funciones (como la escritura de .inp) son buenos candidatos para
pedir ayuda a la IA, asegurándonos luego de verificar y ajustar a nuestras necesidades.
Desarrollo de la Lógica Backend: Empezaremos implementando las rutas (endpoints) para las
funciones principales:
•
•
15 16
•
18
14 17 19
•
•
•
•
•
•
11
POST /uploadShapefiles (o similar): manejar la recepción de archivos zip, su procesamiento a
GeoJSON (Paso 4).
POST /calculate : recibir quizás directamente GeoJSON de las capas (o un indicador de usar lo
ya subido), realizar los cálculos SCS (Paso 5) y almacenar resultados en el servidor (en variables de
sesión o en un simple objeto en memoria, dado que el siguiente paso suele ser exportar
inmediatamente).
GET /export/pcswmm , /export/sewergems , /export/hydrocad : para generar y devolver
los archivos correspondientes (Paso 6). Posiblemente incluyan como parámetro o configuración cuál
proyecto/ejecución se refiere (si la app permitiera multiples concurrentes, habría que manejar IDs,
pero siendo interno, un solo usuario a la vez es aceptable). Aquí nos aseguraremos de poner los
encabezados correctos para forzar la descarga (Content-Disposition: attachment, etc.).
En cada etapa, realizaremos pruebas unitarias con datos simples: por ejemplo, empezaremos con un
shapefile muy sencillo (unos pocos polígonos) para verificar que la lectura a GeoJSON funciona
correctamente y que la reproyección nos da coordenadas plausibles. Luego probaremos la intersección con
casos conocidos (se pueden construir polígonos manualmente para test unitario). Es importante probar la
precisión de cálculo de área de Turf en nuestra región de interés.
Integración Frontend-Backend: Desarrollaremos la interfaz web en paralelo. Si usamos Next.js,
podemos crear páginas React y usar las API routes como backend. Si usamos un frontend separado,
podríamos hospedarlo en Vercel como estático y tener funciones serverless para la API. En cualquier
caso, implementaremos llamadas desde el frontend al backend:
Al seleccionar un archivo (o al droppear el zip), se envía via Fetch/Axios a /uploadShapefiles .
Cuando responda (quizá con un OK y los nombres de capas leídas), podremos en el frontend solicitar
los GeoJSON de esas capas para dibujarlas. Alternativamente, podríamos retornar directamente los
GeoJSON en la respuesta a la subida, para que el cliente los use. Eso ahorra una llamada extra. Sin
embargo, ojo con el tamaño: si los shapefiles son grandes, convertir a GeoJSON puede inflar datos;
pero siendo internal no es crítico. Vercel impone límite de ~5 MB por respuesta en funciones
serverless sin streaming; hay que vigilarlo si los geojson son enormes.
Una vez con GeoJSON en el cliente, usaremos la Google Maps API para dibujar. Crearemos
google.maps.Data layers o convertiremos cada Feature en un google.maps.Polygon . Google
Maps API tiene métodos map.data.addGeoJson(...) que facilita añadirlos directamente si
usamos the Data layer. Esto nos da simplicidad en visualización.
La edición de polígonos probablemente la hagamos sin usar map.data , ya que para hacerlos
editables es más fácil manejarlos como objetos Polygon individuales. Podremos iterar sobre las
features y para cada polígono crear un new google.maps.Polygon({... editable: true}) .
También almacenaremos una referencia para, al hacer Calcular, extraer las coordenadas editadas.
Al presionar Calcular, en lugar de llamar al servidor y que él vuelva a cargar shapefiles, tomaremos
los GeoJSON actuales (post-edición) y los enviaremos en un POST /calculate (enviando JSON). El
backend entonces usará esos geojson directamente. Esto evita re-procesar archivos y nos asegura
que calculamos exactamente sobre lo que se ve en el mapa.
El backend devuelve los resultados calculados (por ejemplo, una lista de cuencas con CN). Podemos
mostrar eso en una tabla HTML para verificación.
Luego, los botones de Export simplemente harán window.location = /export/pcswmm etc., para
activar la descarga. Podríamos pasar un identificador si fuera necesario distinguir proyectos, pero
quizás no haga falta si mantenemos un único resultado en memoria por sesión.
•
•
•
•
•
•
•
•
•
•
12
Pruebas Funcionales: Probaremos la aplicación end-to-end con un caso real. Por ejemplo, tomar un
área conocida, obtener un shapefile de suelos (vía Web Soil Survey o SSURGO), un shapefile de uso
de suelo (quizá de COBERTURA land cover global o Corine si fuera Europa, etc.), y delinear
manualmente una cuenca en un GIS (o incluso dibujarla con nuestra herramienta si ya está
funcional). Cargar esos archivos y verificar:
Que aparecen correctamente alineados en el mapa de Google.
Que la edición funciona (mover un vértice y ver que sigue todo bien).
Al calcular, comprobar con un cálculo independiente que el CN producido tiene sentido (podríamos
hacer una pequeña cuenca donde sabemos el valor de CN esperado).
Probar la exportación: abrir el .inp en PCSWMM y checar que están las subcatchments con los
valores correctos (PCSWMM tiene tablas y mapas donde verificar CN y áreas). En SewerGEMS, probar
ModelBuilder con el shapefile y excel generados, asegurando que las cuencas importadas muestran
el CN deseado o la distribución. En HydroCAD, importar el CSV y ver que crea subcatchments con el
CN y área correctos.
Despliegue en Vercel: Vercel está optimizado para proyectos con front y back integrados (como
Next.js). Asumiremos que usaremos Next.js para facilidad: entonces simplemente conectamos
nuestro repo a Vercel y cada push hará deploy. Si fuésemos con Express separado, Vercel permite
Serverless Functions en el directorio /api , así que podríamos adaptarlo. En cualquier caso, antes del
despliegue, configuraremos la clave de API de Google Maps en Vercel (como variable de entorno) y
en nuestro código la referenciamos. También debemos asegurarnos de restringir esa API key a
nuestro dominio de Vercel (para seguridad). Dado el uso interno, quizás no habrá un dominio
público amplio, pero igualmente es buena práctica.
Documentación y Mejoras Futuras: Junto con la aplicación, prepararemos una breve guía de
usuario (en la que podríamos incluir algunas instrucciones resumidas de importación a los tres
programas). Asimismo, identificaremos mejoras para el futuro: por ejemplo, incorporar también el
cálculo de hidrograma SCS completo (no solo CN), integrar la posibilidad de tener varias alternativas
de cobertura (escenarios), etc. Pero esas quedan fuera del alcance inmediato.
Finalmente, al desplegar en Vercel, tendremos una URL (por ejemplo, stormwater-app.vercel.app )
donde acceder a la aplicación. Internamente la probaremos y luego compartiremos con el equipo. Vercel
nos brinda monitoreo y facilidad de escalado, aunque como es un uso interno con pocos usuarios
simultáneos, el rendimiento de la app debería ser más que suficiente. Hemos priorizado mantener la
complejidad elaborada pero manejable, usando herramientas existentes en lugar de reinventar cálculos, y
orquestando todo con Node/JS para cohesión. Con esta guía, la implementación asistida por IA (vibe coding)
debería ser fluida, y resultará en una aplicación útil para agilizar la preparación de modelos de tormenta a
partir de SIG, eliminando mucho trabajo manual en cada proyecto.
Fuentes consultadas: La metodología SCS y su dependencia de la combinación de uso del suelo y grupo
hidrológico de suelo se basó en documentación del TR-55 . Para leer y convertir shapefiles a GeoJSON se
consideraron librerías JS existentes . Se confirmó la capacidad de Google Maps API para manipular
polígonos editables . El uso de Turf.js para geoprocesamiento (intersecciones y áreas) está sustentado
por su documentación . Las opciones de importación en PCSWMM/SWMM fueron estudiadas,
destacando herramientas de import shapefile a SWMM . Para SewerGEMS, se revisó el uso de
•
•
•
•
•
•
•
1
5 2
3
7 8
13 14
13
ModelBuilder con datos GIS y la importación de distribuciones de uso de suelo . En HydroCAD, se
identificó la función de importación tabular de subcuencas desde CSV , lo que guía nuestro formato
de salida. Estas referencias respaldan las decisiones de diseño aquí expuestas y aseguran que la integración
con los softwares de destino aprovecha sus capacidades existentes. 
"
