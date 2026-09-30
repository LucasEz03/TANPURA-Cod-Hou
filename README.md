# TANPURA — Sitio oficial + Tienda de Merch

Proyecto final del curso de JavaScript. Sitio de la banda de rock **TANPURA**, con una tienda de merchandising funcional integrada como circuito de compra completo.

## 🎸 Sobre el proyecto

El sitio (Inicio, Nosotros, Canciones, Galería, Playlist) está hecho en HTML, CSS/Sass y Bootstrap. Sobre esa base se construyó la **Tienda**, que es la aplicación interactiva pedida en la consigna: un catálogo de productos con carrito de compras, persistencia de datos y un circuito de compra de punta a punta.

## 📁 Estructura del proyecto

```
├── index.html
├── package.json
├── productos.json        → array de objetos con los productos de la tienda
├── app.js                → fetch del catálogo, render y filtro por categoría
├── carrito.js             → lógica del carrito (agregar, quitar, modificar, storage)
├── ui.js                   → notificaciones y confirmaciones (SweetAlert2 / Toastify)
├── css/
│   └── style.css          → CSS compilado (no editar a mano)
├── scss/
│   ├── style.scss         → archivo principal, importa todos los partials
│   ├── _variables.scss
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _inicio.scss
│   ├── _musica.scss
│   ├── _nosotros.scss
│   ├── _galeria.scss
│   ├── _playlist.scss
│   └── _tienda.scss
├── img/
└── pages/
    ├── nosotros.html
    ├── musica.html
    ├── galeria.html
    ├── playlist.html
    └── tienda.html
```

## 🛒 La Tienda — circuito de compra

Catálogo → agregar al carrito → editar cantidades → confirmar compra → descuento de stock → pedido guardado → carrito vaciado.

**Requisitos técnicos cubiertos:**

| Requisito | Dónde está |
|---|---|
| DOM, sin `alert`/`confirm`/`prompt` | Todo el catálogo y carrito se maneja con manipulación del DOM (`app.js`, `carrito.js`) |
| Arrays de objetos en JSON + Fetch | `productos.json`, consumido con `fetch` en `app.js` |
| Funciones de orden superior | `forEach`, `filter`, `find`, `map`, `reduce` |
| Storage (guardar/borrar/modificar/vaciar) | `carrito.js` — carrito y pedidos en `localStorage` |
| Operadores avanzados | Ternarios, `??`, destructuring en `app.js` y `carrito.js` |
| Asincronismo con `try/catch/finally` | `obtenerProductos()` en `app.js` |
| Librería externa de diálogos | SweetAlert2 (confirmaciones) y Toastify (avisos) en `ui.js` |
