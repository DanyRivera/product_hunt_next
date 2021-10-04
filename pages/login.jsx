import React, {useState} from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formularios';

//Firebase
import firebase from '../firebase';

//Validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email: '',
    password: ''
}

const Login = () => {

    const [error, setError] = useState(false);

    const { valores, errores, handleSubmit, handleChange, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

    const {email, password} = valores;

    async function iniciarSesion() {
        try {
            await firebase.login(email, password);
            Router.push('/');
        } catch (error) {
            console.error('Hubo un error al iniciar sesión', error);
            setError(error.message);
        }
    }

    return (
        <div>
    
            <Layout>
                <>
    
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >Login</h1>
    
                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <Campo>
                            <label htmlFor="email">Email:</label>
                            <input 
                                type="email" 
                                placeholder="Tu email" 
                                id="email" 
                                name="email"
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        { errores.email && <Error>{errores.email}</Error> }

                        <Campo>
                            <label htmlFor="password">Password:</label>
                            <input 
                                type="password" 
                                placeholder="Tu password" 
                                id="password" 
                                name="password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        { errores.password && <Error>{errores.password}</Error> }

                        { error && <Error>{error}</Error> }
    
                        <InputSubmit 
                            type="submit" 
                            value="Iniciar Sesión" 
                        />
    
                    </Formulario>
    
                </>
            </Layout>   
    
        </div>
    )
}
 
export default Login;
