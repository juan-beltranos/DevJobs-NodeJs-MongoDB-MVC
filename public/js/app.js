document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');
    if (skills) {

        skills.addEventListener('click', agregarSkills);

        //una vez que estamos en editar,llamar la funcion
        skillsSeleccionados();

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