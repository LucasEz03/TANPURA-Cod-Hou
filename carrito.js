const CLAVE_STORAGE_CARRITO = "tanpura_carrito";
const CLAVE_STORAGE_PEDIDOS = "tanpura_pedidos";

const contenedorCarrito = document.getElementById("items-carrito");
const totalCarritoEl = document.getElementById("total-carrito");
const botonFinalizarCompra = document.getElementById("finalizar-compra");
const botonVaciarCarrito = document.getElementById("vaciar-carrito");
const contadorCarritoEl = document.getElementById("contador-carrito");

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem(CLAVE_STORAGE_CARRITO);
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_STORAGE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(producto, talle = null) {
  const carrito = obtenerCarrito();

  const itemExistente = carrito.find(
    (item) => item.id === producto.id && item.talle === talle
  );

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    const { id, nombre, precio, imagen } = producto;
    carrito.push({ id, nombre, precio, imagen, talle, cantidad: 1 });
  }

  guardarCarrito(carrito);
  renderizarCarrito();
  mostrarToastAgregado(producto.nombre);
}

function quitarDelCarrito(id, talle) {
  const carrito = obtenerCarrito().filter(
    (item) => !(item.id === id && item.talle === talle)
  );

  guardarCarrito(carrito);
  renderizarCarrito();
}

function actualizarCantidad(id, talle, nuevaCantidad) {
  const carrito = obtenerCarrito();
  const item = carrito.find((item) => item.id === id && item.talle === talle);

  if (!item) return;

  item.cantidad = nuevaCantidad > 0 ? nuevaCantidad : 1;
  guardarCarrito(carrito);
  renderizarCarrito();
}

function calcularTotal(carrito) {
  return carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();
  contenedorCarrito.innerHTML = "";

  const totalItems = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  contadorCarritoEl.textContent = totalItems;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<p class="carrito__vacio">Todavía no agregaste nada.</p>`;
    totalCarritoEl.textContent = "$0";
    botonFinalizarCompra.disabled = true;
    return;
  }

  carrito.forEach(({ id, nombre, precio, imagen, talle, cantidad }) => {
    const fila = document.createElement("div");
    fila.className = "carrito__item";
    fila.innerHTML = `
      <img src="${imagen}" alt="${nombre}" class="carrito__imagen" />
      <div class="carrito__info">
        <p class="carrito__nombre">${nombre}${talle ? ` (Talle: ${talle})` : ""}</p>
        <p class="carrito__precio">$${(precio * cantidad).toLocaleString("es-AR")}</p>
        <div class="carrito__cantidad">
          <button class="boton--restar" data-id="${id}" data-talle="${talle ?? ""}">-</button>
          <span>${cantidad}</span>
          <button class="boton--sumar" data-id="${id}" data-talle="${talle ?? ""}">+</button>
        </div>
      </div>
      <button class="boton--quitar" data-id="${id}" data-talle="${talle ?? ""}">Quitar</button>
    `;
    contenedorCarrito.appendChild(fila);
  });

  totalCarritoEl.textContent = `$${calcularTotal(carrito).toLocaleString("es-AR")}`;
  botonFinalizarCompra.disabled = false;
}

contenedorCarrito.addEventListener("click", (evento) => {
  const boton = evento.target;
  const id = Number(boton.dataset.id);
  const talle = boton.dataset.talle || null;

  if (boton.classList.contains("boton--quitar")) {
    quitarDelCarrito(id, talle);
  }

  if (boton.classList.contains("boton--sumar") || boton.classList.contains("boton--restar")) {
    const carrito = obtenerCarrito();
    const item = carrito.find((item) => item.id === id && item.talle === talle);
    if (!item) return;

    const cambio = boton.classList.contains("boton--sumar") ? 1 : -1;
    actualizarCantidad(id, talle, item.cantidad + cambio);
  }
});

botonFinalizarCompra.addEventListener("click", async () => {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) return;

  const confirmado = await confirmarCompra(calcularTotal(carrito));
  if (!confirmado) return;

  const pedidos = JSON.parse(localStorage.getItem(CLAVE_STORAGE_PEDIDOS)) || [];
  const nuevoPedido = {
    fecha: new Date().toISOString(),
    items: carrito,
    total: calcularTotal(carrito),
  };
  pedidos.push(nuevoPedido);
  localStorage.setItem(CLAVE_STORAGE_PEDIDOS, JSON.stringify(pedidos));

  actualizarStockTrasCompra(carrito);

  localStorage.removeItem(CLAVE_STORAGE_CARRITO);
  renderizarCarrito();
  mostrarToastCompraExitosa();
});

botonVaciarCarrito.addEventListener("click", async () => {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;

  const confirmado = await confirmarVaciado();
  if (!confirmado) return;

  localStorage.removeItem(CLAVE_STORAGE_CARRITO);
  renderizarCarrito();
  mostrarToastCarritoVaciado();
});

document.addEventListener("DOMContentLoaded", renderizarCarrito);