const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = () => {

    router.get('/', homeController.mostrarTrabajos);

    //-------------------VACANTES---------------------------//
    //Crear vacantes
    router.get('/vacantes/nueva',vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);

    // Mostrar vacantee
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    //Editar vacante
    router.get('/vacantes/editar/:url', vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url', vacantesController.editarVacante);

     //-------------------CUENTAS---------------------------//
     //crear cuenta
     router.get('/crear-cuenta', usuariosController.formCrearCuenta);
     router.post('/crear-cuenta',
     usuariosController.validarRegistro,
     usuariosController.crearUsuario);
     //Autenticar usuarios
     router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
     router.post('/iniciar-sesion',authController.autenticarUsuario);

    return router;
}