<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\AdminController;
use Controllers\APIController;
use Controllers\CitaController;
use Controllers\Logincontroller;
use Controllers\ServicioController;
use MVC\Router;

$router = new Router();


//Iniciar sesion
$router->get('/', [Logincontroller::class, 'login']);
$router->post('/', [Logincontroller::class, 'login']);
$router->get('/logout', [Logincontroller::class, 'logout']);

//Recuperar password
$router->get('/olvide', [Logincontroller::class, 'olvide']);
$router->post('/olvide', [Logincontroller::class, 'olvide']);
$router->get('/recuperar', [Logincontroller::class, 'recuperar']);
$router->post('/recuperar', [Logincontroller::class, 'recuperar']);

//Crear cuenta
$router->get('/crearCuenta', [Logincontroller::class, 'crear']);
$router->post('/crearCuenta', [Logincontroller::class, 'crear']);

//confirmar cuenta
$router->get('/confirmar-cuenta', [Logincontroller::class, 'confirmar']);
$router->get('/mensaje', [Logincontroller::class, 'mensaje']);

//Area privada
$router->get('/cita', [CitaController::class, 'index']);
$router->get('/admin', [AdminController::class, 'index']);

//API de citas
$router->get('/api/servicios', [APIController::class, 'index']);
$router->post('/api/citas', [APIController::class, 'guardar']);
$router->post('/api/eliminar', [APIController::class, 'eliminar']);

//CRUD de servicios
$router->get('/servicios', [ServicioController::class, 'index']);
$router->get('/servicios/crear', [ServicioController::class, 'crear']);
$router->post('/servicios/crear', [ServicioController::class, 'crear']);
$router->get('/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/servicios/actualizar', [ServicioController::class, 'actualizar']);
$router->post('/servicios/eliminar', [ServicioController::class, 'eliminar']);


// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();