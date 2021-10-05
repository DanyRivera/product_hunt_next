import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import Detallesproducto from '../components/layout/detallesProducto';
import { FirebaseContext } from '../firebase';

const Home = () => {

    const [productos, setProductos] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const obtenerProdcutos = () => {
            firebase.db.collection('productos').orderBy('creado', 'desc').onSnapshot(manejarSnapShot);
        }
        obtenerProdcutos();
    }, [])

    function manejarSnapShot(snapShot) {
        const productos = snapShot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })

        setProductos(productos);
    }

    return (
        <div>

            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {productos.map(producto => (
                                <Detallesproducto 
                                    key={producto.id}
                                    producto={producto}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </Layout>

        </div>
    )
}

export default Home;
