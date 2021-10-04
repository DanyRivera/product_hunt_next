import app from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import firebaseConfig from './config';


class Firebase {

    constructor() {
        !app.apps.length && app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    //Regista un usuario
    async registrar(nombre, email, password) {
        const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);

        //Para el nombre del usuario
        return await nuevoUsuario.user.updateProfile({
            displayName: nombre
        })
    }

    //Inicia Sesion
    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password);
    }

    //Cierra la Sesion
    async cerrarSesion() {
        await this.auth.signOut();
    }

}

const firebase = new Firebase();

export default firebase;