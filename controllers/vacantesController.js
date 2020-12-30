
const Vacante = require('../models/Vacantes');

exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
    })
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