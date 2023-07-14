
let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});


function iniciarApp(){
    mostrarSeccion();
    tabs(); //cambia la seccion cuando se presionen los tabs
    botonesPaginador()//agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();
    consultarAPI(); //consulta la api en el backend
    idCliente();
    nombreCliente(); //añade nombre
    seleccionarFecha();
    seleccionarHora();//añade la hora de la cita
    mostrarResumen();
    
}

function mostrarSeccion(){

    //quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual')
    if(tabAnterior){
        tabAnterior.classList.remove('actual')
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

    //ocultar la seccion que tenga la clase mostrar
    const SeccionAnterior = document.querySelector('.mostrar');
    if(SeccionAnterior){
        SeccionAnterior.classList.remove('mostrar');
    }

    //seleccionar la seccion con el paso
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    });
}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    });
}

async function consultarAPI(){
    
    try {
        const url = `/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();

        mostrarServicios(servicios);
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicio){
    servicio.forEach( servicio => {
        const {id, nombre, precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio)
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);
        
        document.querySelector('#servicios').appendChild(servicioDiv);

    });
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //comprobar si un servicio ya fue agregado
    if( servicios.some(agregado => agregado.id === id ) ){
        cita.servicios = servicios.filter( agregado => agregado.id !== id )
        divServicio.classList.remove('seleccionado');
    }else{
        //agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
}

function idCliente(){
    cita.id = document.querySelector('#id').value;
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        
        const dia = new Date(e.target.value).getUTCDay();
        
        
        if( [6,0].includes(dia) ){
            e.target.value = '';
            mostrarAlerta("Fines de semana no permitidos", 'error', '.formulario');
        }else{
            cita.fecha = e.target.value;
        }
    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){

        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if(hora[0] <10 || hora[0] > 18){
            mostrarAlerta("Hora no valida", "error", '.formulario');
        }else{
            cita.hora = e.target.value;
        }

    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){
    //previene que se cree mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        alertaPrevia.remove();
    }

    //scripting para crear una alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta')
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    //elimina alerta
    if(desaparece){
        setTimeout(()=>{
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');

    if( cita.servicios.lenght === 0 || Object.values(cita).includes('')){
        mostrarAlerta('Faltan datos de servicios, Fecha u Hora','error','.contenido-resumen', false);
        return;
    }

    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    //heading para servicios en resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = "Resumen de Servicios";
    resumen.appendChild(headingServicios);

      //formatear el div de resumen
      const {nombre, fecha, hora, servicios} = cita;

      const nombreCita = document.createElement('P');
      nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;
  
      

      //formatear la fecha en español
      const fechaObj = new Date(fecha);
      const mes = fechaObj.getMonth();
      const dia = fechaObj.getDate() + 2;
      const year = fechaObj.getFullYear();

      const fechaUTC = new Date(Date.UTC(year, mes, dia));

      const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);
  
      const fechaCita = document.createElement('P');
      fechaCita.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;

      const horaCita = document.createElement('P');
      horaCita.innerHTML = `<span>Hora: </span> ${hora}`;


    servicios.forEach(servicio =>{
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = `${servicio.nombre}`;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span> $${servicio.precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    const headingCita = document.createElement('H3');
    headingCita.textContent = "Resumen de Cita";
    resumen.appendChild(headingCita);

   //boton para crear una cita
   const botonReservar = document.createElement('BUTTON');
   botonReservar.classList.add('boton');
   botonReservar.textContent = "Reservar Cita"
   botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCita);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita(){
    const {id, fecha, hora, servicios} = cita;

    const idServicios = servicios.map(servicio => servicio.id)

    const datos = new FormData();
    datos.append('usuarioId', id);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);



    try {
        //preticion hacia la api
    const url = '/api/citas';
    const respuesta = await fetch(url, { 
        method: 'POST',
        body: datos
    })

    const resultado = await respuesta.json();

    console.log(resultado.resultado);

    // console.log([...datos])

    if(resultado.resultado){
        Swal.fire({
            icon: 'success',
            title: 'Cita Creada',
            text: 'Tu cita fue creada correctamenter',
            button: 'Ok'
          }).then( () =>{
            setTimeout(() =>{

                window.location.reload();
            },3000)
          })
    }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita',
          })
    }

    

    
}