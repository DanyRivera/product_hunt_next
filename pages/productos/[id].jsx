/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useContext, useState } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/dist/client/router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import { Campo, InputSubmit } from '../../components/ui/Formularios'
import Boton from '../../components/ui/Boton';


const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Producto = () => {

    //State del componente
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);

    const { firebase, usuario } = useContext(FirebaseContext);

    //Routing para obtener el id actual
    const router = useRouter();
    // console.log(router.query.id);

    const { query: { id } } = router;

    useEffect(() => {
        if (id && consultarDB) {
            // console.log('Ya hay un id', id);
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if (producto.exists) {
                    setProducto(producto.data());
                    setConsultarDB(false);
                } else {
                    setError(true);
                    setConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if (Object.keys(producto).length === 0 && !error) return 'Cargando...';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado } = producto;

    //Administrar y validar los votos
    const votarProducto = () => {
        if (!usuario) {
            return router.push('/');
        }

        //Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //Verificar si el usuario actual a votado
        if (haVotado.includes(usuario.uid)) return;

        //Guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid]

        //Actualizar en la DB
        firebase.db.collection('productos').doc(id).update({ votos: nuevoTotal, haVotado: nuevoHaVotado })

        //Actualizar en el state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })

        setConsultarDB(true); //Hay una modificación por lo que se vuelve a consultar a la DB
    }

    //Funciones para crear comentarios
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    //Identifica si el comentario es del creador del producto
    const esCreador = id => {
        if(creador.id === id) {
            return true;
        }
    }
 
    const agregarComentario = e => {
        e.preventDefault();

        if (!usuario) {
            return router.push('/login');
        }

        //Informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //Tomar una copia de comentarios y agregarlos al arreglo 
        const nuevosComentarios = [...comentarios, comentario];

        //Actualizar la base de datos
        firebase.db.collection('productos').doc(id).update({ comentarios: nuevosComentarios })

        //Actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        setConsultarDB(true); //Hay una modificación por lo que se vuelve a consultar a la DB

    }

    //Función que revisa que el creador del producto sea el mismo que está autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;
        if(creador.id === usuario.uid) {
            return true
        }
    }

    //Funcion para eliminar el producto
    const eliminarProducto = async () => {
        if (!usuario) {
            return router.push('/login');
        }

        if(creador.id === usuario.uid) {
            return router.push('/');
        }

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (
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
    
                                <p>Por: {creador.nombre} de {empresa}</p>
    
                                <img src={urlImagen} alt="imagen producto" />
    
                                <p>{descripcion}</p>
    
                                {usuario && (
                                    <>
                                        <h2>Agrega un Comentario</h2>
    
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    onChange={comentarioChange}
                                                    type="text"
                                                    name="mensaje"
                                                />
                                            </Campo>
    
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar Comentario"
                                            />
                                        </form>
                                    </>
                                )}
    
                                <h2
                                    css={css`
                                        margin: 2rem 0;
                                    `}
                                >Comentarios</h2>
    
                                {comentarios.length === 0 ? "Aún no hay comentarios" : (
    
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            // eslint-disable-next-line react/jsx-key
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por: 
                                                    <span
                                                        css={css`
                                                            font-weight: bold;
                                                        `}
                                                    >{''} {comentario.usuarioNombre}</span>
                                                </p>
    
                                                {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
    
                                            </li>
                                        ))}
                                    </ul>
    
                                )}
    
                            </div>
    
                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >Visitar la URL</Boton>
    
                                <div
                                    css={css`
                                        margin-top: 5rem;
                                    `}
                                >
    
                                    <p
                                        css={css`
                                            text-align: center;
                                        `}
                                    >{votos} Votos</p>
    
                                    {usuario && (
                                        <Boton
                                            onClick={votarProducto}
                                        >
                                            Votar
                                        </Boton>
                                    )}
    
                                </div>
                            </aside>
                        </ContenedorProducto>

                        {puedeBorrar() && 
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar Producto</Boton>
                        }
                    </div>
                )}

            </>
        </Layout>
    );
}

export default Producto;