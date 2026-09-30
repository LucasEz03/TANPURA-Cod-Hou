function mostrarToastAgregado(nombreProducto) {
  Toastify({
    text: `${nombreProducto} agregado al carrito`,
    duration: 2500,
    gravity: "top",
    position: "right",
    style: { background: "#1f1f1f" },
  }).showToast();
}

function mostrarToastCompraExitosa() {
  Toastify({
    text: "¡Compra confirmada! Gracias por tu pedido.",
    duration: 3500,
    gravity: "top",
    position: "right",
    style: { background: "#2e7d32" },
  }).showToast();
}

function mostrarToastCarritoVaciado() {
  Toastify({
    text: "Carrito vaciado",
    duration: 2500,
    gravity: "top",
    position: "right",
    style: { background: "#8a1c1c" },
  }).showToast();
}

async function confirmarVaciado() {
  const resultado = await Swal.fire({
    title: "Vaciar carrito",
    text: "Se van a borrar todos los productos que agregaste. ¿Confirmás?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar",
  });

  return resultado.isConfirmed;
}

async function confirmarCompra(total) {
  const resultado = await Swal.fire({
    title: "Confirmar compra",
    text: `El total de tu pedido es $${total.toLocaleString("es-AR")}. ¿Confirmás la compra?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
  });

  return resultado.isConfirmed;
}