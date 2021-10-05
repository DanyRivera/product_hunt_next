import React from 'react'

const Detallesproducto = ({producto}) => {

    console.log(producto);

    const { id, comentarios, creado, descripcion, empresa, nombre, url, urlImage, votos } = producto;

    return ( 
        <li>
            <div>
                <div>

                </div>
                <div>
                    <h1>{nombre}</h1>
                </div>
            </div>
            <div>

            </div>
        </li>
    );
}
 
export default Detallesproducto;