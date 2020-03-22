---
title: SVG y Sombras
description: Añade sombras a elementos SVG usando filtros CSS/HTML.
date: '2018-11-25T14:59:52.528Z'
categories: []
keywords: []
slug: /@anlijudavid/svg-y-sombras-f8cdcde1601c
---

Añade sombras a elementos SVG usando filtros CSS/HTML.

![](https://cdn-images-1.medium.com/max/800/0*PYm_pMHsQIUykWEx.png)

Añade en tu archivo HTML principal (o en el componente padre donde se mostrará la sombra) el siguiente segmento:

Crear filtro SVG

Tener en cuenta que existe una etiqueta `filter` con el atributo `id`, que mas adelante se usará para aplicar el filtro CSS.

A continuación, se usará CSS para aplicar el filtro SVG en la etiqueta `path` cuando se pase el cursor sobre el mismo, es decir, se aplica el filtro SVG desde CSS cuando es activado el evento `hover`:

Aplicar filtro SVG desde CSS (Ejemplo con SCSS)

y ¿donde está la etiqueta `path`?

Puedes añadir el siguiente segmento:

<svg height="400" width="450">  
  <path id="lineAB" d="M 100 350 l 150 -300" stroke="red"  
  stroke-width="3" fill="none" />  
</svg>

> Nota: Este ejemplo es aplicable a otros elementos SVG.

Mas información en:

[**\- SVG: Scalable Vector Graphics | MDN**  
_The feGaussianBlur SVG filter primitive blurs the input image by the amount specified in stdDeviation, which defines…_developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur "https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur")[](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur)

[**SVG filter feGaussianBlur in percentage**  
_Is it possible to set the feGaussianBlur in %? I don't know why but this does not work. &lt;filter id="drop-shadow"&gt…_stackoverflow.com](https://stackoverflow.com/a/27113087/5125608 "https://stackoverflow.com/a/27113087/5125608")[](https://stackoverflow.com/a/27113087/5125608)