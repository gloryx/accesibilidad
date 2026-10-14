# Laboratorio de Accesibilidad Web

Aplicación educativa para experimentar, comparar y documentar barreras de navegación por teclado y de percepción visual en interfaces web.

## Inicio rápido

Requisitos: Node.js 20.19 o superior y npm.

```bash
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Retos disponibles

### Reto A · Sin mouse

Evalúa alcance, orden y visibilidad del foco, además de la activación de controles mediante Tab, Shift+Tab, Enter y Espacio.

### Reto B · Condiciones visuales difíciles

Presenta un Portal de Servicios Estudiantiles construido con HTML y CSS reales. Permite evaluar contraste, tamaño de texto, dependencia del color y reflujo mediante simulaciones de brillo reducido, reflejo y escalado entre 75 % y 200 %.

Cada reto dispone de instrucciones, cronómetro, modos con barreras y accesible, evaluación, reporte, reinicio, soluciones posteriores y exportación PDF.

## Funcionalidades

| Área | Implementación |
|---|---|
| Comparación | Dos modos por reto sobre el mismo contenido evaluado |
| Reto A | Formulario, validación y registro no intrusivo de controles visitados |
| Reto B | Portal universitario, tres simuladores y cinco actividades verificables |
| Reportes | Respuestas, condiciones utilizadas, recomendaciones y referencias WCAG 2.2 |
| Persistencia | Hasta 10 reportes identificados por reto en `localStorage`, incluyendo migración de datos anteriores |
| Exportación | PDF generado íntegramente en el navegador con jsPDF |
| Accesibilidad | Controles del laboratorio accesibles; defectos limitados a la interfaz evaluada |

## Tecnologías utilizadas

- React 19 y TypeScript para la interfaz y el modelo de datos.
- Vite para desarrollo local y compilación.
- Vitest y Testing Library para pruebas unitarias y de componentes.
- Playwright para pruebas de extremo a extremo en navegador.
- jsPDF para exportar los reportes desde el navegador.
- CSS para el sistema visual, las simulaciones y el diseño responsivo.

## Instalación

Necesitás Node.js 20.19 o superior y npm. Cloná el repositorio e instalá las dependencias:

```bash
git clone https://github.com/gloryx/accesibilidad.git
cd accesibilidad
npm install
```

Para iniciar el entorno de desarrollo:

```bash
npm run dev
```

## Verificación

```bash
npm test
npm run test:e2e
npm run build
```

Las pruebas unitarias usan Vitest. La suite E2E abre Google Chrome y cubre ambos retos: navegación real por teclado, simuladores visuales, reflujo al 200 %, actividades, reportes, soluciones y descarga PDF.

## Estructura

```text
src/
  components/       Pantallas, formularios, portal y simuladores
  hooks/            Cronómetro
  test/             Configuración de Vitest
  utils/            Persistencia y generación de PDF
  App.tsx            Flujo principal y registro de navegación
  data.ts            Datos del Reto A
  visualData.ts      Actividades, respuestas y explicaciones del Reto B
  types.ts           Modelo de datos compartido
  styles.css         Sistema visual responsivo y estados de foco
```

## Criterios WCAG trabajados

Reto A:

- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.3 Focus Order
- 2.4.7 Focus Visible
- 2.4.11 Focus Not Obscured (Minimum)

Reto B:

- 1.4.1 Use of Color
- 1.4.3 Contrast (Minimum)
- 1.4.4 Resize Text
- 1.4.10 Reflow
- 1.4.11 Non-text Contrast
- 1.4.12 Text Spacing

Las soluciones permanecen ocultas durante el ejercicio y se habilitan únicamente en el reporte final.
