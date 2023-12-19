const socket = io()

console.log(socket)

const deleteProduct = (id) => {
  socket.emit('productoEliminado', id)

  fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
}

socket.on('nuevoProducto', (data) => {
  const product = JSON.parse(data)

  const productHTML = `
  <tr>
      <td>${product.id}</td>
      <td>${product.title}</td>
      <td>${product.price}</td>
  </tr>
  `

  const table = document.querySelector('#products');

  table.innerHTML += productHTML
})