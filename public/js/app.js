import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    //limpiar las alertas
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas();
    }
    if (skills) {

        skills.addEventListener('click', agregarSkills);

        //una vez que estamos en editar,llamar la funcion
        skillsSeleccionados();

    }

    // 
    const vacantesListado = document.querySelector('.panel-administracion');
    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
    }
})

const skills = new Set();
const agregarSkills = (e) => {

    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {

            skills.delete(e.target.textContent);
            e.target.classList.remove('activo')

        } else {

            skills.add(e.target.textContent);
            e.target.classList.add('activo')
        }
    }
    // console.log(skills);
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;
}


const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    //console.log(seleccionadas);

    seleccionadas.forEach(seleccionadas => {
        skills.add(seleccionadas.textContent);
    });

    //inyectar en el hidden
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000)
}

//Eliminar vacantes
const accionesListado = e => {
    console.log(e);
}