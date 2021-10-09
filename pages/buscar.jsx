import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import Detallesproducto from '../components/layout/detallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {

    const router = useRouter();
    // console.log(router.query.q);
    const { query: { q } } = router

    //Todos los productos
    const { productos } = useProductos('creado');
    // console.log(productos);

    const [resultado, setResultado] = useState([]);

    useEffect(() => {
        const busqueda = q.toLowerCase();

        const filtro = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        })

        setResultado(filtro);

    }, [q, productos])

    return (
        <div>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul className="bg-white">
                            {resultado.map(producto => (
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

export default Buscar;