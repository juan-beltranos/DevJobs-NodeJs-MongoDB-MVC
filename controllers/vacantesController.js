
const Vacante = require('../models/Vacantes');
const { body, validationResult } = require('express-validator');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
    })
}
exports.validarVacante = async (req, res, next) => {
    //sanitizar los campos
    const rules = [
        body('titulo').not().isEmpty().withMessage('Arega un titulo a la vacante').escape(),
        body('ubicacion').not().isEmpty().withMessage('Agrega una empresa').escape(),
        body('salario').not().isEmpty().withMessage('Agrega una ubicacion').escape(),
        body('contrato').not().isEmpty().withMessage('Selecciona el tipo de contrato').escape(),
        body('skills').not().isEmpty().withMessage('Agrega al menos una habilidad').escape(),
    ];

    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('nueva-vacante', {
            nombrePagina: 'Nueva vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
        return;
    }
    // console.log(errores);
    //si toda la validacion es correcta
    next();
}

//Agrega vacantes a la BD
exports.agregarVacante = async (req, res) => {

    const vacante = new Vacante(req.body);

    //usuario autor de la vacantes
    vacante.autor = req.user._id;

    //Crear arreglo de skills
    vacante.skills = req.body.skills.split(',');
    // console.log(vacante);

    //Almacenar en la BD
    const nuevaVacante = await vacante.save();

    //Redireccionar
    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

//mostrar una vacante
exports.mostrarVacante = async (req, res, next) => {

    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    })

}

//Editar vacante
exports.formEditarVacante = async (req, res, next) => {

    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
    })
}

//Editar vacante y almacenar en la bd
exports.editarVacante = async (req, res, next) => {
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url },
        vacanteActualizada, {
        new: true,
        runValidators: true

    });
    res.redirect(`/vacantes/${vacante.url}`)
}

exports.eliminarVacante = async (req, res) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);

    if (verificarAutor(vacante, req.user)) {
        // Todo bien, si es el usuario, eliminar
        vacante.remove();
        res.status(200).send('Vacante Eliminada Correctamente');
    } else {
        // no permitido
        res.status(403).send('Error')
    }
}

const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) {
        return false
    }
    return true;
}