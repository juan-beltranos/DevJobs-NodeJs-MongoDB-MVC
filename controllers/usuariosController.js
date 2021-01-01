const Usuarios = require('../models/Usuarios');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortId = require('shortid');

exports.subirImagen = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            // console.log(error);
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande : Maximo 100kb')
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message)
            }
            res.redirect('/administracion');
            return;
        } else {
            return next();
        }
    });
}
//opciones de multer
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        limits: { fileSize: 100000 },
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/uploads/perfiles');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortId.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // El callback se ejecuta como true o false
            cb(null, true);
        } else {
            cb(new Error('Formato no valido'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('imagen');

exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })

}

exports.validarRegistro = async (req, res, next) => {
    //sanitizar los campos
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),
        body('password').not().isEmpty().withMessage('El password es obligatorio').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar password es obligatorio').escape(),
        body('confirmar').equals(req.body.password).withMessage('Los passwords no son iguales')
    ];

    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea una cuenta en Devjobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        })
        return;
    }
    // console.log(errores);
    //si toda la validacion es correcta
    next();
}

exports.crearUsuario = async (req, res, next) => {
    // Crear el usuario
    const usuario = new Usuarios(req.body);
    //console.log(usuario);
    try {
        const nuevoUsuario = await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }
}

//Formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesion DevJobs'
    })
}

//form editar el perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuario: req.user,
        nombre: req.user.nombre,
        apellidos: req.user.apellidos,
        email: req.user.email,
        cerrarSesion: true,
        imagen: req.user.imagen
    })
    // console.log(req.user);
}

// Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if (req.body.password) {
        usuario.password = req.body.password
    }

    //Si existe una imagen, subirla
    if (req.file) {
        usuario.imagen = req.file.filename;
    }
    await usuario.save();

    req.flash('correcto', 'cambios guardados correctamente');
    res.redirect('/administracion');

    // console.log(usuario);
}

// sanitizar y validar form de editar perfiles
exports.validarPerfil = async (req, res, next) => {
    //sanitizar los campos
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre no puede ir vacio').escape(),
        body('email').isEmail().withMessage('El correo no puede ir vacio').normalizeEmail(),
    ];
    if (req.body.password) {
        body('password').not().isEmpty().escape();
    }

    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Edita tu perfil en devJobs',
            usuario: req.user,
            nombre: req.user.nombre,
            apellidos: req.user.apellidos,
            email: req.user.email,
            cerrarSesion: true,
            imagen: req.user.imagen,
            mensajes: req.flash()
        })
        return;
    }
    //console.log(errores);
    //si toda la validacion es correcta
    next();
}