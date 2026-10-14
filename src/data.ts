import type { Mode } from './types'

export const MODE_LABELS: Record<Mode, string> = {
  barriers: 'Modo A · Con barreras',
  accessible: 'Modo B · Accesible',
}

export const RULES = [
  'No utilizar el mouse durante la prueba.',
  'Navegar hacia adelante con Tab.',
  'Retroceder con Shift+Tab.',
  'Activar botones con Enter cuando corresponda.',
  'Seleccionar casillas con la barra espaciadora.',
  'Identificar los controles inaccesibles.',
  'Completar el formulario hasta donde sea posible.',
]

export const CRITERIA = [
  'Todos los controles son alcanzables utilizando el teclado.',
  'El foco de navegación es visible.',
  'El orden del foco es lógico.',
  'Los botones y controles pueden activarse sin utilizar el mouse.',
  'No existen barreras que impidan completar el formulario.',
]

export const SOLUTIONS = [
  {
    title: 'Fecha fuera de la navegación secuencial',
    detail:
      'En el Modo A, la fecha usa tabindex="-1". Sigue funcionando con el mouse, pero no se alcanza con Tab.',
    criterion: 'WCAG 2.2 · 2.1.1 Keyboard (incumplimiento)',
  },
  {
    title: 'Orden de foco alterado',
    detail:
      'La carrera usa un tabindex positivo y recibe el foco antes que los campos que la preceden visualmente.',
    criterion: 'WCAG 2.2 · 2.4.3 Focus Order (incumplimiento)',
  },
  {
    title: 'Foco invisible en controles concretos',
    detail:
      'El correo y los comentarios eliminan deliberadamente el indicador visual cuando reciben foco.',
    criterion: 'WCAG 2.2 · 2.4.7 Focus Visible (incumplimiento)',
  },
  {
    title: 'Botón de envío personalizado',
    detail:
      'El control parece un botón y recibe foco, pero sólo escucha clics: Enter y Espacio no lo activan.',
    criterion: 'WCAG 2.2 · 2.1.1 Keyboard (incumplimiento)',
  },
  {
    title: 'Casilla de condiciones personalizada',
    detail:
      'La casilla cambia con clic, pero ignora la barra espaciadora. Su estado tampoco se beneficia del comportamiento nativo.',
    criterion: 'WCAG 2.2 · 2.1.1 Keyboard (incumplimiento)',
  },
  {
    title: 'Sin trampa ni foco oculto por contenido',
    detail:
      'El ejercicio permite avanzar, retroceder y finalizar en todo momento. No se introdujo una trampa de teclado ni contenido fijo que tape el foco.',
    criterion: 'WCAG 2.2 · 2.1.2 y 2.4.11 (cumple en ambos modos)',
  },
]
