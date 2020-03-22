---
title: Un montón de símbolos $
description: >-
  He sido catador de múltiples lenguajes de programación, desde compilados a
  interpretados. Unos más rápidos que otros, otros más cómodos…
date: '2017-12-28T06:42:24.909Z'
categories: []
keywords: []
slug: /@anlijudavid/un-mont%C3%B3n-de-s%C3%ADmbolos-576846f76dc5
---

He sido catador de múltiples lenguajes de programación, desde compilados a interpretados. Unos más rápidos que otros, otros más cómodos, algunos muy amigables con el teclado, otros un poco (_o muy_) esotéricos. En este circuito de recorrido, siempre evitando lenguajes que no me llamaban la atención. Tal fue el caso con _PHP,_ por cuestiones laborales debí dejar a un lado JavaScript & NodeJS (_incluyendo otros como Python, C# y Java_) para entrar en el nuevo — a la vez antiguo — ecosistema de éste lenguaje interpretado.

La primera impresión fue buena, aunque no me acostumbraba del todo a escribir un montón de símbolos de pesos en cada línea de código. Al igual que Java, PHP incluye muchas funciones internas e igualmente la longitud de los nombres es grande. Caracteres y símbolos innecesarios llenaban los archivos de mis proyectos.

Meses antes había desarrollado un sistema básico interpretador de operaciones matemáticas, llamado [Sylver](https://github.com/juliandavidmr/sylver). Su funcionamiento interno puede ser tan simple como complejo dependiendo proporcionalmente de la gramática definida con un sistema YACC.

Había estado cerca de tres meses escribiendo código PHP . Aprendí rápidamente éste lenguaje. Tres días después había migrado a este toda una plataforma construida en C#. Era cuestión de ritmo ya que la plataforma migrada no era tan robusta en ese momento. La idea de crear un lenguaje transpilable rondaba por mi mente desde hacía mucho tiempo, o bueno, se originó cuando aprendí a usar las bases de YACC, Bison, Jison y algunos fundamentos acerca del análisis de patrones basados en gramática.

En fin, después de haber estado probando ejemplos de gramáticas con Jison, me pregunté: _¿Porqué no construir un lenguaje que se transpile a código PHP?_ Me embarqué en la creación de este lenguaje, y por supuesto la sintaxis de el nuevo lenguaje no tendría elementos innecesarios que posee actualmente PHP — se trata del famoso de símbolo $. Al mismo tiempo tomaría como base la sintaxis de otros lenguajes que me gustan mucho, añadiendo similitudes con la gramática de Ruby y Python, también tomando como idea principal la definición de funciones y segmentos de código como lo hace CoffeeScript, donde pueden ser ejecutados de manera muy corta y amigable, me refiero a la redefinición de métodos como creación y obtención de constantes, y muchos otros nuevos Snippets.

El nuevo lenguaje está en fases iniciales, apenas definiendo muchos de los componentes, gramática a traspilar… [Pueden verlo aquí, proyecto **rp**](https://github.com/juliandavidmr/rp)

Gracias por leerme,

_El código fuente está abierto, cualquier ayuda, sugerencia, crítica y documentación será bienvenida._