const contenedorCatalogo = document.getElementById("catalogo");
const spinnerCarga = document.getElementById("spinner-carga");
const selectorCategoria = document.getElementById("filtro-categoria");

let listaProductos = []; 

async function obtenerProductos() {
  spinnerCarga.classList.remove("oculto");

  try {
    const respuesta = await fetch("../productos.json");

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar el catálogo (status ${respuesta.status})`);
    }

    const datos = await respuesta.json();
    listaProductos = datos;
    renderizarProductos(listaProductos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    mostrarErrorCarga();
  } finally {
    spinnerCarga.classList.add("oculto");
  }
}

function renderizarProductos(productos) {
  contenedorCatalogo.innerHTML = "";

  if (productos.length === 0) {
    contenedorCatalogo.innerHTML = `<p class="catalogo__vacio">No hay productos en esta categoría.</p>`;
    return;
  }

  productos.forEach((producto) => {
    const { id, nombre, precio, stock, imagen, talles, descripcion } = producto;

    const hayStock = stock > 0;
    const opcionesTalle = talles?.length
      ? `<select class="tarjeta__talle" data-id="${id}">
          ${talles.map((talle) => `<option value="${talle}">${talle}</option>`).join("")}
        </select>`
      : "";

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-producto";
    tarjeta.innerHTML = `
      <img src="../${imagen}" alt="${nombre}" class="tarjeta__imagen" />
      <h3 class="tarjeta__nombre">${nombre}</h3>
      <p class="tarjeta__descripcion">${descripcion}</p>
      <p class="tarjeta__precio">$${precio.toLocaleString("es-AR")}</p>
      <p class="tarjeta__stock">${hayStock ? `Stock disponible: ${stock}` : "Sin stock"}</p>
      ${opcionesTalle}
      <button
        class="boton boton--agregar"
        data-id="${id}"
        ${hayStock ? "" : "disabled"}
      >
        Agregar al carrito
      </button>
    `;

    contenedorCatalogo.appendChild(tarjeta);
  });
}

function mostrarErrorCarga() {
  contenedorCatalogo.innerHTML = `
    <p class="catalogo__error">
      Ocurrió un problema al cargar los productos. Probá recargar la página.
    </p>
  `;
}

selectorCategoria.addEventListener("change", (evento) => {
  const categoriaElegida = evento.target.value;

  const productosFiltrados =
    categoriaElegida === "todas"
      ? listaProductos
      : listaProductos.filter((producto) => producto.categoria === categoriaElegida);

  renderizarProductos(productosFiltrados);
});

contenedorCatalogo.addEventListener("click", (evento) => {
  if (!evento.target.classList.contains("boton--agregar")) return;

  const idProducto = Number(evento.target.dataset.id);
  const productoElegido = listaProductos.find((producto) => producto.id === idProducto);

  if (!productoElegido) return;

  const selectorTalle = contenedorCatalogo.querySelector(`select[data-id="${idProducto}"]`);
  const talleElegido = selectorTalle ? selectorTalle.value : null;

  agregarAlCarrito(productoElegido, talleElegido);
});

function actualizarStockTrasCompra(itemsComprados) {
  itemsComprados.forEach(({ id, cantidad }) => {
    const producto = listaProductos.find((producto) => producto.id === id);
    if (producto) {
      producto.stock = Math.max(producto.stock - cantidad, 0);
    }
  });

  const categoriaActual = selectorCategoria.value;
  const productosAMostrar =
    categoriaActual === "todas"
      ? listaProductos
      : listaProductos.filter((producto) => producto.categoria === categoriaActual);

  renderizarProductos(productosAMostrar);
}

document.addEventListener("DOMContentLoaded", obtenerProductos);