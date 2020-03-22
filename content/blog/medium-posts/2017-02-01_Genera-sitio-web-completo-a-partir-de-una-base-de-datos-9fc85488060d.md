---
title: Genera sitio web completo a partir de una base de datos
description: >-
  Hoy en día existen muchos generadores para NodeJS, entiéndase por generadores
  todas aquellas librerías y paquetes que poseen la función de…
date: '2017-02-01T17:53:04.485Z'
categories: []
keywords: []
slug: >-
  /@anlijudavid/genera-sitio-web-completo-a-partir-de-una-base-de-datos-9fc85488060d
---

![](https://cdn-images-1.medium.com/max/800/1*5sP2qLm5BU6DrD9xhCwRww.png)

Hoy en día existen muchos [generadores](https://www.npmjs.com/search?q=generator) para [NodeJS](https://nodejs.org/es/), entiéndase por _generadores_ todas aquellas librerías y paquetes que poseen la función de producir una salida; proyecto, sentencias de código, etc. En la actualidad, NodeJS cuenta con más de cuatrocientos mil paquetes para realizar casi toda clase de operaciones.

Hoy se verá como usar un generador automático de código llamado [Sails Inverse Model](https://www.npmjs.com/package/sails-inverse-model)  creado por [David](https://medium.com/u/c704507bac37) y mejorado por la comunidad:

> Sails Inverse Model te ayuda a construir modelos, controladores y vistas para SailsJS desde cualquier base de datos. Además, puedes generar individualmente cada modelo, vista, controlador o los tres al mismo tiempo.

Este generador fue diseñado para crear archivos compatibles con SailsJS — Framework MVC para NodeJS pensado para crear aplicaciones modernas y escalables, destaca a la hora de crear aplicaciones en tiempo real ya que incorpora websockets aunque puede ser usado para crear cualquier tipo de aplicación. _De_ [_Unodepiera._](https://www.uno-de-piera.com/introduccion-a-sails-js/)

Para empezar es necesario conocer y haber usado SailsJS, por lo tanto se requiere una experiencia previa en el uso de JavaScript y comprender el uso de las etiquetas html.

#### Requerimientos

1.  Tener instalado [NodeJS](https://nodejs.org/es/download/current).
2.  Tener instalado MongoDB, PostgreSQL o MySQL.
3.  Disponer de un editor de código: Visual Studio Code, SublimeText, Atom o cualquier otro.

#### Paso 1. Instalar el paquete

Abrir la terminal (o cmd) y ejecutar la siguiente linea:

$ \[sudo\] npm install sails-inverse-model -g

Donde **npm** es el gestor de paquetes de nodejs, **install** proporciona la función de instalar un paquete, **sails-inverse-model** corresponde al nombre del paquete, **\-g** instala el paquete de manera global. Usar **sudo** solo en sistemas Unix.

Verificar que se ha instalado correctamente el paquete:

$ sails-inverse-model --help  
#=> Muestra la ayuda.

#### Paso 2. Preparar la base de datos

SIM (Sails Inverse Model) ofrece dos formas de generar un sitio web, conectándose a una base de datos para generar automáticamente toda la estructura MVC de SailsJS, o sino generar manualmente los ficheros necesarios sin necesidad de un gestor de base de datos.

Para este paso es necesario disponer de una base de datos en PostgreSQL, MongoDB o MySQL. Ademas, deben existir al menos una tabla para observar el resultado de la generación.

#### Paso 3. Generar sitio web

Sí optó por usar MySQL entonces usar la siguiente linea:

$ sails-inverse-model -u root -p root -d mydbmysql -m -v -c  
#=> Muestra la salida de la generación.

Donde **\-u** especifica el nombre de usuario del gestor de MySQL, **\-p** la contraseña, **\-d** nombre de la base de datos, **-m** generar modelos, **\-v** generar vistas y **\-c** genera los controladores.

> Nota: SIM usa mysql como gestor predeterminado.

Copiar y pegar los archivos generados en las respectivas carpetas (modelos, vistas y controladores) de un proyecto de SailsJS.

El procedimiento para PostgreSQL y MongoDB es similar:

\# PostgreSQL  
$ sails-inverse-model -u postgres -p root -d almacen -t pg -m -v -c

\# MongoDB  
$ sails-inverse-model -d blog\_db -t mg -m -v -c

Donde **\-t** especifica el tipo de gestor a usar.

#### Paso 4. Ejecutar proyecto SailsJS

Luego de haber copiado y pegado los archivos generados por SIM en un proyecto de SailsJS, se procede a correr el servidor:

$ cd mi\_proyecto\_sails  
$ sails lift

> SailsJS esta compuesto de otras librerías como el ORM WaterLine y EJS como motor de vistas. Por lo tanto SIM es aplicable a cualquier otro framework o proyecto que implemente una de estos paquetes.

Sí te gustó dale en **❤**, y sí quieres ayudar a mejorar Sails Inverse Model te invito a contribuir en código, traducciones… [Proyecto en Github](https://github.com/juliandavidmr/sails-inverse-model)

Gracias…