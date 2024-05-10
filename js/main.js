let carrito = [];
let nombreUsuarioGlobal = localStorage.getItem('nombreUsuario');

document.getElementById('inicioSesionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const nombreUsuarioLocal = document.getElementById('nombreUsuario').value.trim();
    const numeroTelefono = document.getElementById('telefonoUsuario').value.trim();

    if (nombreUsuarioLocal !== '' && numeroTelefono !== '') {
        console.log("Nombre de usuario:", nombreUsuarioLocal);
        console.log("Número de teléfono:", numeroTelefono);

        localStorage.setItem('nombreUsuario', nombreUsuarioLocal);

        const infoUsuario = {
            nombre: nombreUsuarioLocal,
            telefono: numeroTelefono
        };

        localStorage.setItem('infoUsuario', JSON.stringify(infoUsuario));
        mostrarSesionActiva();
        mostrarMensajeBienvenida(nombreUsuarioLocal);
    } else {
        console.log("Por favor, ingresa tanto el nombre de usuario como el número de teléfono.");
    }
});

document.getElementById('cerrarSesionBtn').addEventListener('click', function () {
    cerrarSesion();
});

function mostrarSesionActiva() {
    const infoUsuario = JSON.parse(localStorage.getItem('infoUsuario'));
    if (infoUsuario) {
        document.getElementById('inicioSesionForm').style.display = 'none';
        document.getElementById('cerrarSesionBtn').style.display = 'inline-block';
    }
}

function cerrarSesion() {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    localStorage.removeItem('infoUsuario');
    localStorage.removeItem('nombreUsuario');
    document.getElementById('inicioSesionForm').style.display = 'block';
    document.getElementById('cerrarSesionBtn').style.display = 'none';

    if (nombreUsuario) {
        mostrarToast(`${nombreUsuario} cerró sesión`);
    }

    if (carrito.length > 0) {
        vaciarCarrito();
    }
}

function mostrarMensajeBienvenida(nombreUsuario) {
    const mensajeBienvenida = document.getElementById('mensajeBienvenida');
    mensajeBienvenida.style.display = 'block';

    Swal.fire({
        title: '¡Bienvenido/a!',
        text: `${nombreUsuario}`,
        icon: 'success',
        confirmButtonText: '¡Gracias!'
    });

    mostrarToast(`Has iniciado sesión como ${nombreUsuario}`);
}

//Carrito de compras.

window.onload = function () {
    cargarCarritoDesdeLocalStorage();
};

function agregarAlCarrito(nombre, precio) {
    const nombreUsuario = localStorage.getItem('nombreUsuario');

    if (nombreUsuario) {
        const productoIndex = carrito.findIndex(item => item.nombre === nombre);
        if (productoIndex !== -1) {
            carrito[productoIndex].cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
        console.log(`${nombreUsuario} agregó ${nombre} al carrito.`);
        mostrarToast("Producto agregado al carrito");
    } else {
        console.log("Por favor, inicia sesión para agregar productos al carrito.");
    }
}

function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    listaCarrito.innerHTML = '';
    let total = 0;

    carrito.forEach((producto, index) => {
        const { nombre, precio, cantidad } = producto;
        const itemCarrito = document.createElement('li');
        itemCarrito.innerHTML = `${nombre} x ${cantidad} - $${precio * cantidad} <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
        listaCarrito.appendChild(itemCarrito);
        total += precio * cantidad;
    });

    document.getElementById('total-carrito').textContent = total;
}

function eliminarDelCarrito(index) {
    const productoEliminado = carrito[index].nombre;
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
    console.log(`${nombreUsuarioGlobal} eliminó ${productoEliminado} del carrito.`);
}

function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
    console.log(`${nombreUsuarioGlobal} vació el carrito.`);
    mostrarToast("El carrito se vació");
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem(nombreUsuarioGlobal, JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem(nombreUsuarioGlobal);
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        mostrarCarrito();
    }
}

function aumentarCantidad(nombre) {
    const productoIndex = carrito.findIndex(item => item.nombre === nombre);
    if (productoIndex !== -1) {
        carrito[productoIndex].cantidad++;
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
        console.log(`${nombreUsuarioGlobal} aumentó la cantidad de ${nombre} en el carrito.`);
    }
}

function disminuirCantidad(nombre) {
    const productoIndex = carrito.findIndex(item => item.nombre === nombre);
    if (productoIndex !== -1) {
        if (carrito[productoIndex].cantidad > 1) {
            carrito[productoIndex].cantidad--;
        } else {
            eliminarDelCarrito(productoIndex);
            return;
        }
        guardarCarritoEnLocalStorage();
        mostrarCarrito();
        console.log(`${nombreUsuarioGlobal} disminuyó la cantidad de ${nombre} en el carrito.`);
    }
}


function obtenerDatosDonas() {
    fetch("./js/donas.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos de las donas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de las donas:', data);
        })
        .catch(error => {
            console.error('Error al obtener los datos de las donas:', error);
        });
}

obtenerDatosDonas();

function mostrarToast(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right,#CC6CE3, #D092DF )",
        },
        onClick: function () { }
    }).showToast();
}