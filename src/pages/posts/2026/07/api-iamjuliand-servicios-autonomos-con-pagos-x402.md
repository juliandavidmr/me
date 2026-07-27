---
title: 'api.iamjuliand.com: servicios autónomos que se cobran solos con x402'
description: 'Presento api.iamjuliand.com, una API de auditorías técnicas y red team de flujos de agentes que liquida cada uso de forma autónoma mediante x402 V2 en Base.'
pubDate: '2026-07-26T10:00:00.000-05:00'
updatedDate: '2026-07-26T12:30:00.000-05:00'
author: 'Julian David'
tags: ['x402', 'api', 'base', 'pagos', 'agentes', 'seguridad']
images: []
---

# api.iamjuliand.com: servicios autónomos con pagos x402

Acabo de lanzar [api.iamjuliand.com](https://api.iamjuliand.com/): una API pública de auditorías técnicas que puede descubrirse, usarse y cobrarse sin crear cuentas, generar claves de API ni montar un checkout tradicional.

La idea es simple: un servicio debería poder declarar qué hace, cuánto cuesta y cómo se paga. Un cliente —incluido un agente— debería poder usarlo de forma autónoma cuando lo necesita.

Para eso uso [x402](https://www.x402.org/), el protocolo que convierte el código HTTP `402 Payment Required` en una negociación de pago directamente dentro de una petición HTTP.

## El flujo de pago

La primera petición a uno de los endpoints de pago no ejecuta el trabajo de inmediato. La API valida la entrada y responde con `402`, junto con los requisitos de pago x402 V2.

El cliente firma el pago y repite exactamente la solicitud con el encabezado `PAYMENT-SIGNATURE`. Cuando la liquidación se confirma, recibe el resultado y el encabezado `PAYMENT-RESPONSE`.

No hay formularios ni redirecciones entre la intención y el resultado. El pago forma parte del protocolo que ya usa la aplicación.

Los pagos de producción se hacen en Base. La API también tiene una especificación de prueba en Base Sepolia para integrar el flujo sin usar fondos reales.

## Los primeros productos

El servicio reúne tareas pequeñas y útiles para herramientas de desarrollo y agentes. Los cuatro productos iniciales son deterministas:

- **Escanear secretos** en código o configuración por **$0.005**. Devuelve hallazgos redactados, no credenciales expuestas.
- **Auditar documentos OpenAPI** por **$0.012**: calidad, seguridad, interoperabilidad y facilidad de uso para agentes.
- **Revisar prompts y archivos `AGENTS.md`** por **$0.008** para encontrar permisos excesivos, contradicciones y riesgos operativos.
- **Inferir o validar JSON Schema** por **$0.006** a partir de muestras o de un esquema suministrado.

También publiqué **`agent-workflow-red-team`**, un red team de flujos de agentes por **$0.12**. Recibe el prompt del agente, las herramientas disponibles, sus efectos laterales, la política operacional y escenarios con contenido no confiable. Primero analiza localmente las capacidades, los permisos y los límites declarados; después realiza una revisión adversarial estructurada con IA para identificar ataques, hallazgos, mitigaciones y pruebas de regresión.

Este último producto no es determinista: su revisión adversarial usa IA y devuelve el modelo y el uso asociado como parte del resultado. No ejecuta las herramientas suministradas; las evalúa como contrato del flujo para encontrar brechas antes de ponerlas en producción.

Cada producto define sus límites de entrada y tiempo de respuesta. La liquidación ocurre solo después de que la entrada es válida y el servicio responde correctamente; una solicitud inválida no se cobra.

## Hecha para que humanos y agentes la encuentren

Además de los endpoints de producto, publiqué los contratos que hacen posible una integración sin conversación previa:

- [OpenAPI](https://api.iamjuliand.com/openapi.json) para herramientas y clientes HTTP.
- [Manifiesto x402](https://api.iamjuliand.com/.well-known/x402) con la información de pago legible por máquinas.
- [Guía para agentes](https://api.iamjuliand.com/llms.txt) con el flujo de integración.
- [Catálogo del servicio](https://api.iamjuliand.com/) con productos, precios y límites actuales.

Esto importa porque un agente no debería necesitar una integración hecha a medida para cada servicio. Si puede leer el contrato, enfrentar el desafío `402`, pagar y reintentar la petición, puede usar la capacidad por sí mismo.

## Por qué me interesa este modelo

Las APIs convencionales suelen comenzar con una cuenta, una llave secreta, planes, facturas y conciliación. Ese modelo tiene sentido para relaciones sostenidas, pero añade fricción a una acción puntual y verificable.

Con x402, una herramienta puede pagar exactamente por una operación. El proveedor recibe el pago al completar un trabajo útil; el cliente no tiene que entregar una tarjeta, crear una cuenta ni comprometerse a una suscripción.

Todavía es una etapa inicial, pero me entusiasma la dirección: servicios pequeños, composables y verificables que los agentes puedan contratar igual que llaman una API.

Si quieres probarlo o integrar un cliente, empieza por el [OpenAPI público](https://api.iamjuliand.com/openapi.json) o por la [guía de integración](https://api.iamjuliand.com/llms.txt).
