export default function validarCrearProducto(valores) {
    let errores = {};

    //Valdiar el nombre del usuario
    if (!valores.nombre) {
        errores.nombre = "EL nombre es obligatorio"
    }

    if(!valores.empresa) {
        errores.empresa = "El nombre de la empresa es obligatorio"
    }

    if(!valores.url) {
        errores.url = "El url es obligatoria"
    } else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "Url no válida o mal formateada"
    }

    if(!valores.descripcion) {
        errores.descripcion = "La descripcion es obligatoria"
    }

    return errores;
}