---
title: Pasos para crear una librería para NodeJS
description: Creando una librería para generar nombres de gatos
date: '2017-02-08T05:04:53.246Z'
categories: []
keywords: []
slug: /@anlijudavid/pasos-para-crear-una-librer%C3%ADa-para-nodejs-fa49b17558b8
---

![](https://cdn-images-1.medium.com/max/800/1*aHFsN7UZSODqIug3zHTufw.jpeg)

Probablemente tengas en mente desarrollar una librería para NodeJS. Al final de esta publicación tendrás tu librería publicada en [npm](https://www.npmjs.com). Antes de eso, hablaré un poco de mis proyectos personales. — Hasta ahora he creado siete paquetes para NodeJS, una de esas ha llegado bastante bien en la comunidad de JavaScript, se llama [_Sails Inverse Model_](https://www.npmjs.com/package/sails-inverse-model). Una parte de las otras seis librerías fueron creadas para complementar la anterior, el resto solamente realiza operaciones sencillas.

Empecemos… Antes de entrar a ver código es necesario cumplir con otros pasos:

1.  Crear una cuenta de usuario en [npm.js](https://www.npmjs.com).
2.  Instalar [NodeJS](https://nodejs.org/es/).
3.  Instalar un editor de código. Quizás te guste Atom, Visual Studio Code o Sublime Text.
4.  Pasos obvios: _Saber JavaScript y usar la consola._

Esta publicación posee un subtitulo muy particular: _Creando una librería para generar nombres de gatos._ Se trata de una librería existente creada por desarrollador muy conocido, su nombre es [Sindre Sorhus](https://medium.com/u/37166cebf99b) _(o al menos así se hace llamar)_. La función de este paquete es mostrar nombres aleatorios de gatos, y la he escogido por su sencillez en el código fuente. También ha creado librerías para generar nombres de perros, súper héroes, pokémones, súper villanos y arboles… Aunque posee una cantidad absurda de librerías, [mas de 900 paquetes publicados en npm.](https://www.npmjs.com/~sindresorhus) :O

> En esta guía veremos el funcionamiento del paquete [_cat names_](https://github.com/sindresorhus/cat-names)  y como programarla. Posteriormente, se hará el proceso de subir este paquete al repositorio de npm.

### Paso 1. Crear archivos

Crear una carpeta que contendrá todos los archivos fuente de la librería.

$ mkdir cat-names

Posteriormente debes crear **cuatro archivos** dentro del directorio “_cat-names_”:

**index.js — **Aquí va el código que será ejecutado cuando la función _require()_ sea llamada. P.ej:

var cats = require('cat-names');

**cli.js — **Si tu librería es una aplicación de consola entonces debes usar este archivo. **No** depende de la función “_require()_” para ser ejecutado, y puede ser usado como cualquier otro programa de consola, p.ej:

$ `cat-names --help`

El ejemplo anterior se ejecuta desde la terminal, donde _cat-names_ es el llamado de la aplicación a ejecutar, y _help_ es un parámetro. _Otro ejemplo similar: “ping 8.8.8.8”, donde ping es el programa a ejecutar y 8.8.8.8 el parámetro._

**package.json — **Contiene toda la información fundamental de nuestro paquete. Aquí se especifica el nombre del paquete, version, descripción, licencia, autor, información del autor, palabras clave, dependencias…

**cat-names.json** — Listado de nombres de gatos.

### Paso 2. Programar paquete

> cat-names.json

> **index.js**

**Linea 2.** Importar librería para generar un valor aleatorio según un vector dado.

**Linea 3.** Obtiene una lista de nombres de gatos.

**Linea 5.** Exporta la lista de nombres de gatos.

**Linea 6.** Obtiene el nombre de un gato usando el paquete _uniqueRandomArray_.

> **cli.js**

**Linea 4.** Librería para gestión de parámetros y mensajes en la terminal.

**Linea 5.** Importar el archivo _index.js._ Node reconoce por defecto que ./ es _index.js_

**Linea 7 — 19.** Mensaje de ayuda para mostrar en la terminal.

**Linea 21.** Muestra el resultado de la operación solicitada, es decir, devuelve el listado de gatos o un gato aleatorio.

> **package.json**

**Descripción de las claves (keys):**

*   **name.** Nombre del paquete. Será mostrado en npm.js
*   **version.** Versión del paquete. Es importante mantener una secuencia ordenada (p.ej: 1.0.0–1.0.1–1.0.2–1.0.3…), de esta manera la secuencia aumenta cada vez que se haga una actualización.
*   **description.** Descripción del paquete. Será mostrada en npm.js
*   **license.** Tipo de licencia de software.
*   **repository**. Enlace al repositorio del código fuente. Enlace de Github, Gitlab…
*   **author.** Datos acerca del autor.
*   **bin.** Clave usada para especificar el archivo que se debe ejecutar cuando el paquete se solicite desde la terminal.
*   **files**. Archivos que deben ser seleccionados para subir al repositorio de npm.js.
*   **engines.** Especifica las versiones de node en la que funciona el paquete:
*   **scripts.** Contiene los comandos que se ejecutan en varias ocasiones en el ciclo de vida de su paquete.
*   **keywords**. Palabras clave que describen el paquete. Esto ayuda a que las personas descubran tu paquete cuando buscan en npm.
*   **dependencies**. Especifica las dependencias asignadas a nuestro paquete. Se describe el nombre de paquete junto a un intervalo de versiones.
*   **devDependencies**. Dependencias necesarias para desarrollar el paquete.

> [Ver Guía completa](https://docs.npmjs.com/files/package.json)

Es importante crear el archivo de documentación README.md. [Ver ejemplo.](https://gist.github.com/juliandavidmr/2a9d88aeb8f0c4027bd80fc188df6342)

### Paso 3. Probar código

En este paso vamos a verificar que nuestro paquete esté funcionando correctamente. Para esto es necesario instalar las dependencias:

\# Acceder al directorio  
$ cd cat-names

\# Instalar paquetes  
$ npm install  
#=> Se muestra todo el proceso de instalación de dependencias 

$ node cli.js --help  
#=> Muestra la ayuda de nuestro paquete

$ node cli.js  
#=> Muestra el nombre de un gato

$ node cli.js --all  
#=> Muestra una lista de gatos

### Paso 4. Iniciar sesión en NPM

> Se exige tener una cuenta de usuario en npm.js

\# Iniciar la sesión desde la terminal  
$ npm login

#= Se solicitan las credenciales (email & password)

### Paso 5. (Ultimo) Subir librería a NPM

Ultimo paso. Se carga todo el paquete al repositorio oficial de NodeJS, en instantes quedará disponible públicamente.

$ npm publish  
#=> Muestra el proceso de carga.  
#=> Finalmente se muestra el resultado de la operación.

### Recomendaciones

1.  Recuerda aumentar la secuencia de la versión para evitar errores de subida.
2.  Cada vez que se agregue un nuevo archivo o carpeta es importante referenciarlo en el _package.json_, dentro de la clave _files._
3.  Es importante escribir toda la documentación que sea necesaria para especificar el funcionamiento de tu paquete. Esto ayudará a que otros usuarios entiendan como instalar y usar tu librería.
4.  Si quieres dar a conocer tu librería, deberías publicarlo en las redes sociales. Un tweet con los hashtag adecuados puede llegar a muchos usuarios en poco tiempo.
5.  Recuerda mantener actualizada las versiones de las dependencias. Algunas veces estos se convierten en paquetes obsoletos de un momento a otro.
6.  [Mantener buenas practicas de desarrollo.](http://www.w3schools.com/js/js_best_practices.asp)

### Otros ejemplos para ver

1.  [Argvd](https://www.npmjs.com/package/argvd)
2.  [Entorn](https://www.npmjs.com/package/entorn)
3.  [Dog names](https://github.com/sindresorhus/dog-names)

Espero que te haya gustado esta guía :). Me gustaría conocer la(s) librería(s) que has desarrollado. Gracias por leer.