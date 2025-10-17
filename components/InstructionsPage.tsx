import React from 'react';

const instructionsContent = {
  es: {
    title: 'Bienvenido',
    intro:
      'Esta herramienta te guía en la preparación y revisión de áreas de drenaje antes de exportarlas a otros formatos.',
    stepsTitle: 'Pasos para comenzar',
    steps: [
      'Carga un archivo Shapefile o GeoPackage desde el panel izquierdo. Cada capa se validará automáticamente y el registro mostrará cualquier advertencia.',
      'Primero sube las Drainage Areas, asigna un Discharge Point (DP-##) a cada polígono y luego incorpora las Drainage Subareas vinculándolas a esos mismos DP. Puedes cargar la capa de suelos (WSS) en cualquier momento; después de añadirla, la capa de Land Cover seguirá con la detección automática habitual.',
      'Revisa el panel de capas para activar o desactivar la visibilidad, cambiar estilos y seleccionar qué capa editar.',
      'Usa el mapa para revisar geometrías. Puedes editar atributos clave como el Discharge Point # (DP-##), la cobertura del suelo y verificar o completar manualmente el HSG (A/B/C/D) en la capa WSS desde los controles contextuales.',
      'Cuando los datos estén listos, utiliza el botón Exportar para generar archivos HydroCAD, SWMM o nuevos Shapefiles, y confirma la proyección correspondiente.',
    ],
    sections: [
      {
        heading: 'Funciones clave',
        items: [
          'Panel de carga: admite arrastrar y soltar archivos, detecta automáticamente archivos con nombre DA-TO-DP.zip o SUB-DA.zip y muestra el progreso de procesamiento.',
          'Registro de eventos: sigue los mensajes de validación, errores y acciones realizadas durante la sesión.',
          'Modal de mapeo de campos: vincula atributos entrantes con los esperados por la aplicación.',
          'Capa en edición: guarda o descarta cambios para mantener la integridad de los datos.',
        ],
      },
      {
        heading: 'Requisitos antes de exportar',
        items: [
          'La capa LOD debe contener exactamente un polígono válido.',
          'Carga por separado las Áreas de Drenaje generales (una por punto de descarga) y las Subáreas de Drenaje asociadas mediante el campo PARENT_DA, asegurando que cada área use su Discharge Point numerado (DP-##).',
          'La aplicación generará la subárea complementaria cuando las subáreas cargadas no cubran el área general; revisa y valida esos resultados.',
          'Confirma que cada subárea tenga Land Cover y que cada polígono de la capa WSS cuente con un HSG verificado (autoasignado o completado manualmente) en A/B/C/D.',
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
      'Load the Drainage Areas first, assign a Discharge Point (DP-##) to every polygon, then import the Drainage Subareas and link them to those discharge points. You can add the WSS soil layer at any time; once it is present the Land Cover layer continues with the usual auto-detection.',
      'Review the layer panel to toggle visibility, adjust styles, and choose which layer is currently editable.',
      'Use the map to inspect geometries. Contextual controls let you edit key attributes like the Discharge Point # (DP-##), Land Cover, and review or manually complete the HSG value (A/B/C/D) on the WSS features.',
      'When the dataset is ready, open the Export dialog to generate HydroCAD, SWMM, or Shapefile outputs and confirm the desired projection.',
    ],
    sections: [
      {
        heading: 'Key features',
        items: [
          'Upload panel: supports drag and drop, auto-detects archives named DA-TO-DP.zip or SUB-DA.zip, and surfaces processing status for each file.',
          'Log panel: tracks validation messages, errors, and user actions during the session.',
          'Field mapping modal: aligns incoming attributes with those expected by the application.',
          'Editing workflow: save or discard changes to maintain clean and consistent datasets.',
        ],
      },
      {
        heading: 'Pre-export checklist',
        items: [
          'The LOD layer must contain exactly one valid polygon.',
          'Upload general Drainage Areas (one per discharge point) and their Drainage Subareas, linking each subarea with the PARENT_DA field and keeping the Discharge Point numbering (DP-##) consistent.',
          'The application will synthesize a complementary subarea whenever the uploaded subareas do not cover the full drainage area—review those results carefully.',
          'Ensure every subarea carries Land Cover information and that each WSS polygon has a verified Hydrologic Soil Group (auto-filled or manually completed as A/B/C/D).',
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
