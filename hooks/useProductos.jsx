import React, {useState, useEffect, useContext} from 'react';
import { FirebaseContext } from '../firebase';

const useProductos = orden => {

    const [productos, setProductos] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const obtenerProdcutos = () => {
            firebase.db.collection('productos').orderBy(orden, 'desc').onSnapshot(manejarSnapShot);
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

    return {
        productos
    };
}
 
export default useProductos;