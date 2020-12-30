const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = require('../models/Vacantes');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son onbligatorios'
});


//Revisar si el usuario esta autenticado
exports.verificarUsuario = (req, res, next) => {
    //revisar usuario
    if (req.isAuthenticated()) {
        return next();
    }

    //REdireccionar
    res.redirect('/iniciar-sesion');
}


exports.mostrarPanel = async (req, res) => {

    //consultar usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id }).lean();
    res.render('administracion', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Crea y administra tus vacantes desde aqui',
        cerrarSesion: true,
        nombre: req.user.nombre,
        vacantes
    })
}
exports.cerrarSesion = (req, res) => {
    //cerrar sesion
    req.logout();
    //mesaje de alerta
    req.flash('correcto', 'Cerraste sesion correctamente');
    //
    return res.redirect('/iniciar-sesion');
}