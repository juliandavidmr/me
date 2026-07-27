---
title: 'Loomca: compras con asistentes de IA y control humano'
description: 'Presento Loomca, una herramienta que conecta asistentes de IA con comercios Shopify verificados para descubrir productos y preparar compras que las personas revisan y pagan directamente en el checkout del comercio.'
pubDate: '2026-07-26T12:00:00.000-05:00'
updatedDate: '2026-07-26T12:00:00.000-05:00'
author: 'Julian David'
tags: ['ia', 'comercio electrónico', 'shopify', 'asistentes de ia', 'mcp']
images: []
---

# Loomca: compras con asistentes de IA y control humano

Acabo de lanzar [Loomca](https://loomca.com/), una herramienta para que los asistentes de IA ayuden a encontrar productos y preparar una compra sin sacar a la persona de las decisiones importantes.

La propuesta parte de una idea sencilla: un asistente puede hacer el trabajo de búsqueda y organización, pero la persona debe conservar el control sobre qué compra y cómo paga.

En Loomca, el asistente encuentra productos de comercios Shopify verificados, presenta la información disponible y prepara una compra para revisión. La persona recibe un enlace de aprobación, revisa el producto y el costo proyectado, y solo después continúa al checkout existente del comercio para pagar.

## El problema

Comprar con ayuda de un asistente todavía suele implicar mucho trabajo manual. Hay que buscar entre tiendas, comparar variantes, comprobar si un producto está disponible y trasladar esa información a un checkout.

Un asistente de IA puede reducir parte de esa fricción, pero no debería convertirse en una caja negra que compra por su cuenta. En comercio, la claridad importa tanto como la rapidez: la persona necesita saber qué se seleccionó, cuánto podría costar y qué datos siguen pendientes de confirmar.

## Cómo funciona

El flujo de Loomca tiene tres momentos:

1. **El asistente encuentra productos.** Consulta comercios Shopify activos y sus catálogos elegibles.
2. **La persona revisa y aprueba.** Loomca crea un enlace de aprobación con el producto seleccionado, el costo proyectado y cualquier incertidumbre conocida.
3. **El pago ocurre en Shopify.** Tras aprobar, la persona continúa al checkout propio del comercio para completar el pago.

Loomca no guarda los datos de la tarjeta ni reemplaza la relación entre el comprador y el comercio. Su papel es conectar la intención expresada a un asistente con un catálogo real y un proceso de compra que el usuario puede inspeccionar antes de actuar.

## Diseñado para ambos lados

Para quien compra, Loomca ofrece herramientas de compra que se pueden añadir a un asistente de IA. La configuración empieza eligiendo el asistente y conectando las herramientas; después basta con iniciar una conversación y pedir ayuda para comprar.

Para los comercios, el punto de partida es Shopify. Al conectar su tienda, Loomca verifica el catálogo y los requisitos del checkout antes de que los productos puedan aparecer en búsquedas asistidas. El comercio conserva su checkout y su operación de pago.

Esta separación es importante: Loomca facilita el descubrimiento y la preparación de la compra, mientras que Shopify sigue siendo el lugar donde se realiza el pago.

## Por qué lo construí

Me interesa una forma de comercio asistido que sea útil sin pedir confianza ciega. Un asistente puede ahorrar tiempo al interpretar una necesidad, encontrar opciones y preparar una decisión. Pero preparar no es decidir.

El enlace de aprobación es el límite deliberado del producto. Convierte una recomendación o una selección hecha en una conversación en algo concreto que la persona puede revisar antes de pasar al checkout.

Loomca está disponible en [loomca.com](https://loomca.com/). Si quieres comprar con un asistente de IA o conectar una tienda Shopify, allí puedes empezar.
