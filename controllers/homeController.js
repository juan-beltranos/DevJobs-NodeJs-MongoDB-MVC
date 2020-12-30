const Vacante = require('../models/Vacantes');


exports.mostrarTrabajos = async (req, res, next) => {

    const vacantes = await Vacante.find().lean();

    if (!vacantes) return next();

    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y publica trabajos devs',
        barra: true,
        boton: true,
        vacantes
    });
}