import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formularios';
import Error404 from '../components/layout/404';

//Firebase
import { FirebaseContext } from '../firebase';
import FileUploader from 'react-firebase-file-uploader';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    // imagen: '',
    url: '',
    descripcion: ''
}

const NuevoProducto = () => {

    //State de las imagenes
    const [nombreImagen, setNombre] = useState('');
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlImagen, setUrlImagen] = useState('');

    const [error, setError] = useState(false);

    const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const { nombre, empresa, imagen, url, descripcion } = valores;

    //Hook de routing para redireccionar
    const router = useRouter();

    //Context con las operaciones CRUD de Firebase
    const { firebase, usuario } = useContext(FirebaseContext);


    async function crearProducto() {
        //Si el usuario no está autenticado llevar al Login
        if (!usuario) {
            return router.push('/login');
        }

        //Crear el objeto de nuevo producto
        const producto = {
            nombre,
            empresa,
            url,
            urlImagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado: []
        }

        //Insertar el producto en la base de datos
        firebase.db.collection('productos').add(producto);

        return router.push('/');
    }


    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    }

    const handleProgress = progreso => setProgreso({ progreso });

    const handleUploadError = error => {
        setSubiendo(error);
        console.log(error);
    }

    const handleUploadSuccess = nombre => {
        setProgreso(100);
        setSubiendo(false);
        setNombre(nombre);
        firebase
            .storage
            .ref("productos")
            .child(nombre)
            .getDownloadURL()
            .then(url => {
                console.log(url)
                setUrlImagen(url);
            })
    }

    return (
        <div>

            <Layout>

                {!usuario ? <Error404 /> : (
                    <>

                        <h1
                            css={css`
                                            text-align: center;
                                            margin-top: 5rem;
                                        `}
                        >Nuevo Producto</h1>

                        <Formulario
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            <fieldset>
                                <legend>Información General</legend>

                                <Campo>
                                    <label htmlFor="nombre">Nombre:</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre del Producto"
                                        id="nombre"
                                        name="nombre"
                                        value={nombre}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.nombre && <Error>{errores.nombre}</Error>}

                                <Campo>
                                    <label htmlFor="imagen">Empresa:</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre Empresa o Compañia"
                                        id="empresa"
                                        name="empresa"
                                        value={empresa}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.empresa && <Error>{errores.empresa}</Error>}

                                <Campo>
                                    <label htmlFor="imagen">Imagen</label>
                                    <FileUploader
                                        accept="image/*"
                                        randomizeFilename
                                        id="imagen"
                                        name="imagen"
                                        storageRef={firebase.storage.ref("productos")}
                                        onUploadStart={handleUploadStart}
                                        onUploadError={handleUploadError}
                                        onUploadSuccess={handleUploadSuccess}
                                        onProgress={handleProgress}
                                    />
                                </Campo>


                                <Campo>
                                    <label htmlFor="url">URL</label>
                                    <input
                                        type="url"
                                        id="url"
                                        name="url"
                                        placeholder="URL del producto"
                                        value={url}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.url && <Error>{errores.url}</Error>}

                            </fieldset>

                            <fieldset>
                                <legend>Sobre tu Producto</legend>

                                <Campo>
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        value={descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Campo>

                                {errores.descripcion && <Error>{errores.descripcion}</Error>}

                            </fieldset>

                            {error && <Error>{error}</Error>}

                            <InputSubmit
                                type="submit"
                                value="Crear Producto"
                            />

                        </Formulario>

                    </>
                )}


            </Layout>

        </div>
    )
}

export default NuevoProducto;
