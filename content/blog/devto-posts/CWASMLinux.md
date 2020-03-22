---
title: C + WASM + Linux
description: C + WASM + Linux
date: '2019-11-24T14:59:52.528Z'
categories: []
keywords: [wasm, c, linux]
slug: /@anlijudavid/svg-y-sombras-f8cdcde1601c
---


WASM (WebAssembly) es un área del desarrollo Web que está tomando mucha fuerza últimamente. He estado realizando algunas pruebas de WASM y C, y para esta oportunidad comparto con ustedes esta publicación que detallan los pasos requeridos para montar una prueba exitosa de una función en C ejecutada desde Javascript en el navegador.

> Los pasos a continuación fueron probados en [Ubuntu](https://ubuntu.com), también son aplicables a otros sistemas operativos basados en este. Los pasos que hacen uso de la terminal fueron ejecutados desde una misma sesión _(de terminal)_.

## Pasos

### Paso 1: Instalación de [emscripten](https://emscripten.org/docs/getting_started/downloads.html):

```bash
# Ubicarse en una carpeta donde desee proceder con la instalación
cd Documents

# Descargar codigo fuente de Emscripten (emsdk repo)
git clone https://github.com/emscripten-core/emsdk.git

# Entrar al directorio
cd emsdk

# Descargar e instalar lo más reciente del SDK tools.
./emsdk install latest

# Construir el "latest" SDK y "active" para el usuario actual. (escribe el archivo ~/.emscripten)
./emsdk activate latest

# Activar el PATH y otras variables de entorno en la terminal actual
source ./emsdk_env.sh
```

### Paso 2: Escribir código C.

A continuación, creamos la función `myFunction` que mostrará un mensaje y retornará el argumento numérico `argc` multiplicado por `2`.

```c
/// main.c

#include <stdio.h>
#include <stdlib.h>
#include <emscripten/emscripten.h>

int main(int argc, char ** argv) {
        printf("WebAssembly module loadedn");
        return 0;
}

#ifdef __cplusplus
extern "C" {
#endif

int EMSCRIPTEN_KEEPALIVE myFunction(int argc, char ** argv) {
        printf("MyFunction Called");
        return argc * 2;
}

#ifdef __cplusplus
}
#endif
```

Notas:

1. La librería `emscripten/emscripten.h` estará disponible una vez se ha completado el paso 1.
2. La etiqueta `EMSCRIPTEN_KEEPALIVE` hace que la función `myFunction` esté disponible en JavaScript después de la compilación.

### Paso 3: Compilar C en WASM

```bash
emcc main.c -O3 -o index.js -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"
```

Notas:

1. El comando toma `main.c` como archivo de entrada y genera el archivo `index.js`.
2. El archivo `index.js` expone la función `ccall` que será usada posteriormente para ejecutar `myFunction`.
3. El comando genera otro archivo llamado `index.wasm` el cual contiene todo el código compilado.

### Paso 4: Cargar código compilado en el navegador.

#### Paso 4.1: Crear archivo `main.html`.

```html
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>WebAssembly Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <button id="myFunc">Call myFunction</button>
    <!-- Include the JavaScript glue code. -->
    <!-- This will load the WebAssembly module and run its main. --> 
    <script async src="index.js"></script>
    <script>
    	document.getElementById('myFunc').addEventListener('click', function(ev) {
	    	var result = Module.ccall(
		    'myFunction',     // name of C function 
		    'number',       // return type
		    ['number'],     // argument types
		    [42]);          // arguments

            console.log('Result:', result);
    	});
    </script>
  </body>
</html> 
```

Notas:

1. Cada vez que el botón "Call myFunction" sea presionado, se ejecuta la función `myFunction` con el argumento `42` de tipo `number`.

#### Paso 4.2: Montar servidor local

> Este paso es opcional si ya dispones de alguna herramienta para montar un servidor local.

1. Instalar el paquete global [`local-web-server`](https://www.npmjs.com/package/local-web-server) de npm.

    ```bash
    npm i local-web-server -g
    ```

2. Crear un archivo con el nombre `lws.config.js` y agregar el siguiente contenido:

    ```js
    module.exports = {
       mime: {
          'application/wasm': ['wasm']
       }
    };
    ```

    Este archivo hace que el navegador efectúe correctamente el llamado del archivo `index.wasm`, si esto no se agrega es posible que el navegador no pueda procesar el mime `application/wasm`, y no se carga el código compilado.

3. Correr servidor HTTP local:

    ```bash
    ws
    # Muestra algo como: Listening on http://david:8000, http://127.0.0.1:8000

    ```

4. Abrir un navegador web _(Google Chrome o Firefox)_ con alguno de los enlaces mostrados en el paso anterior a este, por ejemplo: `http://127.0.0.1:8000`.

5. Abrir la ventana de desarrollo del navegador web (F12) y entrar a la pestaña "Console". Luego, dentro de la pagina web debes presionar el botón "Call myFunction", en la consola aparecerá un mensaje con el resultado de nuestra función `myFunction` => `Result: 84`.


Finalmente podemos entender todo el flujo de ejecución de WASM así:

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/5cpjwfc0084p11f26ee0.png)

---

No olvides escribir un comentario si tienes alguna duda, también puedes visitar mi pequeño sitio web en https://juliandavidmr.github.io.

Gracias por leer. ;)


## Referencias

* [Comenzando con webassembly](https://programacion.net/articulo/comenzando_con_webassembly_1835)
* [emscripten, getting started](https://emscripten.org/docs/getting_started/downloads.html)
* [WebAssembly concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts)
* [webassembly in browsers](https://blog.mozilla.org/blog/2017/11/13/webassembly-in-browsers/)