let stockProductos = [
    {id: 1, nombre: "Pan o Dientes", precio: 1200, img: 'public/pano-dientes.png', cantidad:1},
    {id: 2, nombre: "Plagiador Telepatico", precio: 1100, img: 'public/plagiador.png', cantidad:1},
    {id: 3, nombre: "southern Madness", precio: 1200, img: 'public/southern.png', cantidad:1},
    {id: 4, nombre: "Vakam", precio: 1400, img: 'public/vakam.png', cantidad:1},
    {id: 5, nombre: "Hermanos Animales", precio: 1200, img: 'public/hermanosanimales.png', cantidad:1},
    {id: 6, nombre: "Cuando el viento no Mueve las Hojas", precio: 1500, img: 'public/antologia.png', cantidad:1},

]

let divDeCompra = [];
const itemsShop = document.getElementById('items-shop');
const seccionCompra = document.getElementById('section-compra');

const precioTotal = document.getElementById('precioTotal');
let carritoStorage =[];


fetch('/stock.json')
.then( (respuesta) => respuesta.json()) 
.then( (data) => {
    data.forEach((producto) => {
        let div = document.createElement('div')
        div.className = 'producto'
        div.innerHTML = `
                        <img src=${producto.img} class="items-img" alt="portada-panodientes">
                        <p>${producto.nombre}</p>
                        <p>$${producto.precio}</p>
                        <button type="button" class="btn btn-warning"><a id="btnAgregar${producto.id}">Comprar</a></button>
        `
        
        itemsShop.appendChild(div)

        
        let btnAgregar = document.getElementById(`btnAgregar${producto.id}`)
    
        btnAgregar.addEventListener('click', ()=>{
            agregarAcompra(producto.id)
            Toastify({
                text: "Producto agregado al carrito",
                duration: 2000
            }).showToast();
        })
        if (localStorage.getItem("carrito")) {
            carritoStorage = JSON.parse(localStorage.getItem("carrito"))
            carritoStorage.map((producto) => {
                let div = document.createElement('div')
                div.className='productoEnCompra'
                div.innerHTML = `
                                <div class="col-sm-12 col-md-12 col-lg-6 p-2 shadow-sm">
                                    <p>${producto.nombre}</p>
                                    <p>Precio: $${producto.precio}</p>
                                    <p>Cantidad: ${producto.cantidad}</p>
                                    <button id="btnEliminar${producto.id}" type="button" class="btn btn-warning"><a>Eliminar</a></button>
                                </div>
                                `
                seccionCompra.appendChild(div);
        
                actualizarCompra(carritoStorage);
                let btnEliminar = document.getElementById(`btnEliminar${producto.id}`)
        
                btnEliminar.addEventListener('click',()=>{
                        swal({
                            title: '¿Esta seguro de eliminar el producto?',
                            icon: 'warning',
                            buttons: true,
                            dangerMode: true,
                        }).then((result) => {
                            if (result) {
                                btnEliminar.parentElement.remove()
                                divDeCompra = divDeCompra.filter(elemento => elemento.id != producto.id)
                                actualizarCompra()
                                swal({
                                    title: 'Borrado',
                                    icon: 'success',
                                    text: 'El producto ha sido borrado con éxito'
                                })
                            }
                        })
                })
                
            })
        }
    })
})



function agregarAcompra(id) {

    let agregarProducto = stockProductos.find(item => item.id == id)

    divDeCompra.push(agregarProducto)

    actualizarCompra()

    let div = document.createElement('div')
    div.className='productoEnCompra'
    div.innerHTML = `
                    <div class="col-sm-12 col-md-12 col-lg-6 p-2 shadow-sm">
                        <p>${agregarProducto.nombre}</p>
                        <p>Precio: $${agregarProducto.precio}</p>
                        <p>Cantidad: ${agregarProducto.cantidad}</p>
                        <button id="btnEliminar${agregarProducto.id}" type="button" class="btn btn-warning"><a>Eliminar</a></button>
                    </div>
                    `

     seccionCompra.appendChild(div)
     
    let btnEliminar = document.getElementById(`btnEliminar${agregarProducto.id}`)

        btnEliminar.addEventListener('click',()=>{
            swal({
                title: '¿Esta seguro de eliminar el producto?',
                icon: 'warning',
                buttons: true,
                dangerMode: true,
            }).then((result) => {
                if (result) {
                    btnEliminar.parentElement.remove()
                    divDeCompra = divDeCompra.filter(elemento => elemento.id != agregarProducto.id)
                    actualizarCompra()
                    swal({
                        title: 'Borrado',
                        icon: 'success',
                        text: 'El producto ha sido borrado con éxito'
                    })
                }
            })
        })

}


function  actualizarCompra(){
    localStorage.setItem("carrito", JSON.stringify(divDeCompra));
    precioTotal.innerText = divDeCompra.reduce((acc,el)=> acc + (el.precio * el.cantidad),0)
    
}