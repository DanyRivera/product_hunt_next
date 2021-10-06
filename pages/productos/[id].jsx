import React, { useEffect, useContext, useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/dist/client/router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import {Campo, InputSubmit} from '../../components/ui/Formularios'


const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const Producto = () => {

    //State del componente
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false); 

    const { firebase } = useContext(FirebaseContext);

    //Routing para obtener el id actual
    const router = useRouter();
    // console.log(router.query.id);

    const { query: { id } } = router;

    useEffect(() => {
        if (id) {
            // console.log('Ya hay un id', id);
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists) {
                    setProducto(producto.data());
                } else {
                    setError(true);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if(Object.keys(producto).length === 0) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos } = producto;

    return (
        <Layout>
            <>
                { error && <Error404/> }

                <div className="contenedor">
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >{nombre}</h1>

                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(creado), { locale: es })}</p>

                            <img src={urlImagen} alt="imagen producto" />

                            <p>{descripcion}</p>

                            <h2>Agrega un Comentario</h2>

                            <form>
                                <Campo>
                                    <input 
                                        type="text" 
                                        name="mensaje"
                                    />
                                </Campo>

                                <InputSubmit 
                                    type="submit"
                                    value="Agregar Comentario"
                                />
                            </form>

                            <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                            >Comentarios</h2>

                            {comentarios.map( comentario => (
                                // eslint-disable-next-line react/jsx-key
                                <li>
                                    <p>{comentario.nombre}</p>
                                    <p>Escrito por: {comentario.usuarioNombre}</p>
                                </li>
                            ))}
                        </div>

                        <aside>
                            2
                        </aside>
                    </ContenedorProducto>
                </div>

            </>
        </Layout>
    );
}

export default Producto;