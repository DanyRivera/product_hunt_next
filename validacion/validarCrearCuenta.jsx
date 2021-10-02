export default function validarCrearCuenta(valores) {
    let errores = {};

    //Valdiar el nombre del usuario
    if (!valores.nombre) {
        errores.nombre = "EL nombre es obligatorio"
    }

    //Valdiar el email del usuario
    if (!valores.email) {
        errores.email = "EL email es obligatorio"
    } else if( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
        errores.email = "EL email no es válido"
    }

    //Valdiar el nombre del usuario
    if (!valores.password) {
        errores.password = "EL password es obligatorio"
    } else if(valores.password.length < 6) {
        errores.password = "El password debe ser menos 6 caracteres"
    }


    return errores;
}