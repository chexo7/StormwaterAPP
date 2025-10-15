import React from 'react';

const instructionsContent = {
  es: {
    title: 'Bienvenido',
    intro:
      'Esta herramienta te guía en la preparación y revisión de áreas de drenaje antes de exportarlas a otros formatos.',
    stepsTitle: 'Pasos para comenzar',
    steps: [
      'Carga un archivo Shapefile o GeoPackage desde el panel izquierdo. Cada capa se validará automáticamente y el registro mostrará cualquier advertencia.',
      'Revisa el panel de capas para activar o desactivar la visibilidad, cambiar estilos y seleccionar qué capa editar.',
      'Usa el mapa para revisar geometrías. Puedes editar atributos clave como Housing (HSG), nombre del área de drenaje y cobertura del suelo desde los controles contextuales.',
      'Cuando los datos estén listos, utiliza el botón Exportar para generar archivos HydroCAD, SWMM o nuevos Shapefiles, y confirma la proyección correspondiente.',
    ],
    sections: [
      {
        heading: 'Funciones clave',
        items: [
          'Panel de carga: admite arrastrar y soltar archivos y muestra el progreso de procesamiento.',
          'Registro de eventos: sigue los mensajes de validación, errores y acciones realizadas durante la sesión.',
          'Modal de mapeo de campos: vincula atributos entrantes con los esperados por la aplicación.',
          'Capa en edición: guarda o descarta cambios para mantener la integridad de los datos.',
        ],
      },
      {
        heading: 'Requisitos antes de exportar',
        items: [
          'Solicita y carga shapefiles separados para LOD, WSS, Land Cover, Áreas de Drenaje generales (por punto de descarga) y Subáreas de Drenaje asociadas.',
          'La capa LOD debe contener exactamente un polígono válido; se usa como referencia del proyecto, no para recortar las áreas tributarias.',
          'Asegúrate de que cada subárea herede un nombre de área de drenaje (DA_NAME) y un identificador propio (SUBDA_NAME); la aplicación calcula automáticamente cualquier área complementaria necesaria.',
          'Verifica que las capas de Land Cover y WSS aporten los atributos LAND_COVER y HSG requeridos para el cálculo SCS.',
        ],
      },
    ],
    toggleLabel: 'Ver en inglés',
  },
  en: {
    title: 'Welcome',
    intro:
      'This workspace helps you prepare and review drainage area data before exporting to downstream modeling tools.',
    stepsTitle: 'Getting started',
    steps: [
      'Upload a Shapefile or GeoPackage from the left panel. Each layer is validated automatically and the activity log will highlight any warnings.',
      'Review the layer panel to toggle visibility, adjust styles, and choose which layer is currently editable.',
      'Use the map to inspect geometries. Contextual controls let you edit key attributes like Housing (HSG), Drainage Area name, and Land Cover.',
      'When the dataset is ready, open the Export dialog to generate HydroCAD, SWMM, or Shapefile outputs and confirm the desired projection.',
    ],
    sections: [
      {
        heading: 'Key features',
        items: [
          'Upload panel: supports drag and drop and surfaces processing status for each file.',
          'Log panel: tracks validation messages, errors, and user actions during the session.',
          'Field mapping modal: aligns incoming attributes with those expected by the application.',
          'Editing workflow: save or discard changes to maintain clean and consistent datasets.',
        ],
      },
      {
        heading: 'Pre-export checklist',
        items: [
          'Request and upload distinct shapefiles for the LOD, WSS, Land Cover, general Drainage Areas (per discharge point), and associated Drainage Subareas.',
          'The LOD layer must contain exactly one valid polygon; it acts as a project reference and is not used to clip tributary areas.',
          'Ensure each subarea carries the parent drainage area name (DA_NAME) and its own identifier (SUBDA_NAME); the app will build any complementary subareas automatically.',
          'Confirm that the Land Cover and WSS layers supply the LAND_COVER and HSG attributes required for SCS calculations.',
        ],
      },
    ],
    toggleLabel: 'View in Spanish',
  },
} as const;

type Language = keyof typeof instructionsContent;

const InstructionsPage: React.FC = () => {
  const [language, setLanguage] = React.useState<Language>('es');
  const content = instructionsContent[language];

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-300 p-8">
      <div className="max-w-2xl w-full space-y-6 bg-gray-800/50 rounded-lg p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-cyan-400">{content.title}</h2>
          <button
            type="button"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="px-4 py-2 text-sm font-semibold text-gray-900 bg-cyan-400 rounded-md hover:bg-cyan-300 transition"
          >
            {content.toggleLabel}
          </button>
        </div>

        <p className="text-left leading-relaxed">{content.intro}</p>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-cyan-300">{content.stepsTitle}</h3>
          <ol className="list-decimal list-inside space-y-2 text-left">
            {content.steps.map((step, index) => (
              <li key={`${language}-step-${index}`}>{step}</li>
            ))}
          </ol>
        </div>

        {content.sections.map((section, sectionIndex) => (
          <div key={`${language}-section-${sectionIndex}`} className="space-y-2">
            <h3 className="text-xl font-semibold text-cyan-300">{section.heading}</h3>
            <ul className="list-disc list-inside space-y-1 text-left">
              {section.items.map((item, itemIndex) => (
                <li key={`${language}-section-${sectionIndex}-item-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionsPage;
