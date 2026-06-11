---
title: 'Enmascarar email con Javascript'
description: 'Cuando se trata de proteger la privacidad en línea, ocultar direcciones de correo electrónico es una práctica común. En este breve artículo, exploraremos el uso de expresiones regulares (regex) en un ejemplo de código React para lograr este'
pubDate: '2023-10-13T15:22:00.002-05:00'
updatedDate: '2023-10-13T15:22:21.827-05:00'
author: 'Julian David'
tags: ['react', 'tutorial']
originalUrl: 'https://www.iamjuliand.com/2023/10/enmascarar-email-con-javascript.html'
bloggerId: '7275898541266449741'
commentsCount: 0
images: []
---

Cuando se trata de proteger la privacidad en línea, ocultar direcciones de correo electrónico es una práctica común. En este breve artículo, exploraremos el uso de expresiones regulares (regex) en un ejemplo de código [React](https://react.dev) para lograr este propósito. Vamos a analizar el siguiente código:

```jsx
import { useState } from 'react';

const email = 'my.custom.email@domain.com';
const regex = /(\w{3}).*/g;

export function App() {
  const [hide, setHide] = useState(false);
  const renderEmail = hide
    ? email.replace(regex, '$1********@********')
    : email;

  return (
    <div>
      {renderEmail}
      <br />
      <button
        type="button"
        onClick={() => {
          setHide((prev) => !prev);
        }}
      >
        {hide ? 'Show email' : 'Hide email'}
      </button>
    </div>
  );
}
```

## Desglose del Regex

En este código, se utiliza la expresión regular `/(\w{3}).*/g` para ocultar parte de la dirección de correo electrónico. Desglosemos cada parte:

- `/`: Delimita el inicio y el final de la expresión regular.
- `(\w{3})`: Captura los primeros tres caracteres de la dirección de correo electrónico y los almacena en el grupo de captura `$1`.
- `.*`: Coincide con el resto de la dirección de correo electrónico.

## Desventajas y solución

Aunque esta técnica puede ser efectiva, presenta algunas desventajas:

- **Dependencia del lado del cliente**: Este enfoque depende del código ejecutándose en el lado del cliente, lo que significa que no proporciona una solución integral de seguridad. Recuerda que la seguridad es un tema complejo, y estas soluciones deben usarse con precaución y en combinación con otras medidas de seguridad.
- **Limitado a direcciones específicas**: Este regex asume que las direcciones de correo electrónico siempre tendrán al menos tres caracteres antes del símbolo `@`, lo cual puede no ser cierto en todos los casos. Aquí propongo dinamizar la captura de los elementos con regex de la siguiente manera:

```jsx
const regex = /(.*)@.*/g;

const renderEmail = hide
  ? email.replace(regex, (match, group1) => {
      const usernameLength = group1.length;
      return `${group1.substring(0, usernameLength / 2)}${'*'.repeat(usernameLength / 2)}@${'*'.repeat(6)}`;
    })
  : email;
```

- Se define una expresión regular (`/(.*)@.*/g`) que busca una cadena que tenga algún texto antes y después del símbolo `@` en una dirección de correo electrónico.
- Luego, el reemplazo se realiza tomando el texto antes del símbolo `@` y reemplazando la segunda mitad de ese texto con asteriscos. También se reemplaza la parte después del `@` con asteriscos.
