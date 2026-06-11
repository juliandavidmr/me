---
title: " Añade sombras a elementos SVG usando CSS"
description: "Añade en tu archivo HTML principal (o en el componente padre donde se mostrará la sombra) el siguiente segmento: &lt;svg&gt; &lt;filter id=\"dropshadow\" height=\"130%\"&gt; &lt;feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"3\"&gt;&lt;/feGaussia"
pubDate: "2017-01-06T15:51:00.000-05:00"
updatedDate: "2023-08-04T16:12:44.302-05:00"
author: "Julian David"
tags: ["css","frontend","svg","web"]
originalUrl: "https://www.iamjuliand.com/2018/11/anade-sombras-elementos-svg-usando-css.html"
bloggerId: "8172132580347965925"
commentsCount: 0
images: ["/assets/blog/2018/11/anade-sombras-elementos-svg-usando-css/01.webp"]
imgSrc: "/assets/blog/2018/11/anade-sombras-elementos-svg-usando-css/01.webp"
imgAlt: " Añade sombras a elementos SVG usando CSS"
---
<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYHFb0FMyco2_DuAD4r8XNBR97qxwSQOY6rz6OcbSpe_WmoG6u6WVq93eQcWKhjXHIfC7OagJtZySfGtKjwst4cM8puGsn9rYDhsMqWKcQT-uhdwHMlBmdWQBbUAN_ko5CYdcVpoZJvMfDooXjLaVA4ZiNXAOfigxxvI76D_AvIEbrUryePt_gCNPUp4M/s450/0*PYm_pMHsQIUykWEx.webp" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" data-original-height="209" data-original-width="450" height="149" src="/assets/blog/2018/11/anade-sombras-elementos-svg-usando-css/01.webp" width="320" /></a></div><br />Añade en tu archivo HTML principal (o en el componente padre donde se mostrará la sombra) el siguiente segmento:<div><br /></div><div><table class="highlight tab-size js-file-line-container js-code-nav-container js-tagsearch-file" data-hpc="" data-paste-markdown-skip="" data-tab-size="8" data-tagsearch-lang="HTML" data-tagsearch-path="shadow.html" style="border-collapse: collapse; border: 0px; caret-color: rgb(51, 51, 51); color: #333333; font-family: ui-monospace, SFMono-Regular, &quot;SF Mono&quot;, Menlo, Consolas, &quot;Liberation Mono&quot;, monospace; font-size: 12px; font-variant-caps: normal; line-height: 1.4; margin: 0px; padding: 0px;"><tbody><tr><td class="blob-code blob-code-inner js-file-line" id="file-shadow-html-LC1" style="background-attachment: scroll; background-clip: border-box; background-image: none; background-origin: padding-box; background-position: 0% 0%; background-repeat: repeat; background-size: auto; border: 0px; color: var(--color-fg-default); line-height: 20px; overflow-wrap: anywhere; overflow: visible; padding-bottom: 1px !important; padding-left: 10px !important; padding-right: 10px !important; padding-top: 4px; position: relative; vertical-align: top; white-space: pre;"><pre style="caret-color: rgb(0, 0, 0); color: black; overflow-wrap: break-word; white-space: pre-wrap;"><span style="font-family: Source Code Pro;">&lt;svg&gt;
  &lt;filter id="dropshadow" height="130%"&gt;
    &lt;feGaussianBlur in="SourceAlpha" stdDeviation="3"&gt;&lt;/feGaussianBlur&gt; &lt;!-- stdDeviation is how much to blur --&gt;
    &lt;feOffset dx="2" dy="2" result="offsetblur"&gt;&lt;/feOffset&gt; &lt;!-- how much to offset --&gt;
    &lt;feComponentTransfer&gt;
      &lt;feFuncA type="linear" slope="0.5"&gt;&lt;/feFuncA&gt; &lt;!-- slope is the opacity of the shadow --&gt;
    &lt;/feComponentTransfer&gt;
    &lt;feMerge&gt;
      &lt;feMergeNode&gt;&lt;/feMergeNode&gt; &lt;!-- this contains the offset blurred image --&gt;
      &lt;feMergeNode in="SourceGraphic"&gt;&lt;/feMergeNode&gt; &lt;!-- this contains the element that the filter is applied to --&gt;
    &lt;/feMerge&gt;
  &lt;/filter&gt;
&lt;/svg&gt;</span></pre></td></tr></tbody></table><div><br /></div><br />Tener en cuenta que existe una etiqueta <u><span style="font-family: courier;">filter</span></u> con el atributo <u><span style="font-family: courier;">id</span></u>, que mas adelante se usará para aplicar el filtro CSS.<br /><br />A continuación, se usará CSS para aplicar el filtro SVG en la etiqueta <u><span style="font-family: courier;">path</span></u> cuando se pase el cursor sobre el mismo, es decir, se aplica el filtro SVG desde CSS cuando es activado el evento <span style="font-family: courier;">hover:</span></div><div><span style="font-family: courier;"><br /></span></div><div><pre style="overflow-wrap: break-word; white-space: pre-wrap;"><span style="font-family: Source Code Pro;">path {
  stroke-width: 1px;

  &amp;:hover {
    cursor: pointer;
    stroke-width: 2px;
    filter: url(#dropshadow);
  }
}</span></pre>y ¿donde está la etiqueta path? Puedes añadir el siguiente segmento:<br /></div><div><br /></div><span style="font-family: Source Code Pro;">&lt;svg height="400" width="450"&gt;<br />&nbsp; &nbsp; &lt;path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none" /&gt;<br />&lt;/svg&gt;</span><br /><br /><br />Nota: Este ejemplo es aplicable a otros elementos SVG.<br /><br />Mas información en:&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur">https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur</a>
