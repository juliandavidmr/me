---
title: 'Mouse Hand: controlar el cursor con gestos de la mano'
description: 'Cómo construí Mouse Hand, un experimento de vibe coding para controlar el cursor del computador con una webcam, detección de manos e instrucciones nativas del sistema.'
pubDate: '2026-06-21T10:00:00.000-05:00'
updatedDate: '2026-06-21T10:00:00.000-05:00'
author: 'Julian David'
tags: ['vibe coding', 'tauri', 'svelte', 'tensorflow', 'computer vision', 'ia']
images:
  [
    'https://raw.githubusercontent.com/juliandavidmr/mouse-hand/main/screenshot.png',
  ]
repoUrl: 'https://github.com/juliandavidmr/mouse-hand'
---

# Mouse Hand

Mouse Hand es un pequeño experimento de escritorio que permite controlar el cursor del computador usando gestos de la mano frente a la webcam.

La idea nació como parte de mi nuevo proyecto de **vibe coding**: construir prototipos rápidos, curiosos y funcionales usando IA como compañera de programación, sin perder de vista la experiencia real del usuario.

En este caso quería probar algo muy concreto:

> ¿Qué tan lejos puedo llegar si combino una webcam, detección de manos y comandos nativos del sistema para mover el cursor?

El resultado fue una app compacta que detecta la mano, sigue el dedo índice y traduce algunos gestos simples en acciones del mouse.

![Mouse Hand mostrando un diagrama virtual de la mano y controles compactos](https://raw.githubusercontent.com/juliandavidmr/mouse-hand/master/screenshot.png)

## La idea

No quería reemplazar el mouse ni el trackpad.

Mouse Hand nació más bien como una exploración sobre interfaces físicas: esas interacciones donde el cuerpo se vuelve parte directa del sistema.

El primer objetivo era sencillo:

- Levantar el dedo índice.
- Mover la mano.
- Ver el cursor moverse en pantalla.

Pero apenas eso empezó a funcionar, el prototipo pidió más:

- ¿Y si cerrar la mano activara el modo puntero?
- ¿Y si juntar el índice y el pulgar hiciera click?
- ¿Y si mantener ese gesto permitiera arrastrar y soltar?
- ¿Y si la app mostrara en tiempo real lo que el modelo estaba entendiendo?

Ahí Mouse Hand empezó a sentirse como algo más que una prueba técnica.

## Cómo funciona

Mouse Hand usa [`@tensorflow-models/hand-pose-detection`](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection) con [MediaPipe Hands](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) para detectar 21 puntos clave de la mano desde la cámara.

La app se concentra principalmente en tres cosas:

- La punta del dedo índice para mover el cursor.
- La distancia entre el pulgar y el índice para detectar el gesto de pinza.
- La posición de las articulaciones para saber si la mano está cerrada con el índice levantado.

Cuando el gesto es válido, la interfaz envía las coordenadas a [Tauri](https://tauri.app/). Desde el lado nativo, la app mueve el cursor real del sistema usando [Enigo](https://github.com/enigo-rs/enigo).

## Gestos

| Gesto                                       | Acción             |
| ------------------------------------------- | ------------------ |
| Mano cerrada + índice levantado             | Mover el puntero   |
| Índice + pulgar completamente juntos        | Click / mouse down |
| Mantener la pinza mientras se mueve la mano | Arrastrar          |
| Soltar la pinza                             | Mouse up / soltar  |

El gesto de pinza es intencionalmente estricto.

No quería que la app hiciera clicks accidentales cada vez que los dedos estuvieran cerca, así que el sistema espera hasta que el índice y el pulgar estén realmente juntos.

## La interfaz

La interfaz es pequeña porque Mouse Hand se comporta más como una utilidad que como un dashboard.

Incluye:

- Un diagrama grande de la mano detectada.
- Una vista compacta de la cámara.
- Controles para activar o desactivar puntero y click.
- Un slider para ajustar la velocidad.
- Estado en vivo del gesto y la confianza del modelo.

El diagrama de la mano terminó siendo una de las partes más útiles del proyecto.

Cuando trabajas con visión por computador, muchas veces el problema no es que el modelo falle, sino que tú no sabes exactamente qué está viendo. Visualizar los puntos de la mano hizo mucho más fácil ajustar los gestos y entender por qué algunas interacciones se sentían raras.

## Stack técnico

- **[Tauri](https://tauri.app/)** para la app de escritorio y los comandos nativos.
- **[SvelteKit](https://svelte.dev/docs/kit/introduction)** para la interfaz.
- **[Bun](https://bun.sh/)** para el entorno de desarrollo.
- **[TensorFlow.js hand pose detection](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection)** para el seguimiento de la mano.
- **[MediaPipe Hands](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)** como modelo de detección.
- **[Rust](https://www.rust-lang.org/) + [Enigo](https://github.com/enigo-rs/enigo)** para mover el mouse, hacer click, mouse down y mouse up.

## Lo que aprendí

La parte difícil no fue detectar una mano.

Lo difícil fue hacer que los gestos se sintieran intencionales.

Pequeños detalles cambiaron mucho la experiencia:

- Suavizar el movimiento para evitar saltos.
- Agregar control de velocidad.
- Hacer menos sensible el gesto de pinza.
- Usar mouse down y mouse up en lugar de solo click, para permitir arrastrar y soltar.
- Mostrar los puntos detectados para depurar lo que el modelo entendía.

Este tipo de proyectos me gusta porque obligan a cerrar el ciclo completo: cámara, mano, puntos clave, gesto, acción nativa y respuesta visual.

No se queda solo en una demo bonita. Se siente en el cuerpo.

## Por qué entra en mi proyecto de vibe coding

Para mí, vibe coding no es pedirle a la IA que haga todo y aceptar el primer resultado.

Es usarla como una forma de acelerar exploraciones, probar ideas extrañas y mantener el flujo creativo mientras sigo tomando decisiones de producto, diseño e implementación.

Mouse Hand encaja perfecto en esa búsqueda porque mezcla varias capas:

- Una idea fácil de explicar.
- Un reto técnico interesante.
- Una interfaz pequeña pero útil.
- Una interacción que se puede probar inmediatamente.
- Un resultado imperfecto, pero tangible.

Esa es la clase de prototipo que quiero construir más seguido: proyectos que empiezan como una pregunta y terminan como algo que puedo usar, tocar, romper y mejorar.

## Código

El código está disponible en [GitHub](https://github.com/):

[github.com/juliandavidmr/mouse-hand](https://github.com/juliandavidmr/mouse-hand)

Para ejecutarlo localmente:

```bash
bun install
bun run tauri dev
```

En [macOS](https://www.apple.com/macos/), la app necesita [permiso de cámara](https://support.apple.com/guide/mac-help/control-access-to-the-camera-on-mac-mchlf6d108da/mac) y [permiso de Accesibilidad](https://support.apple.com/guide/mac-help/allow-accessibility-apps-to-access-your-mac-mh43185/mac) para poder controlar el cursor del sistema.
