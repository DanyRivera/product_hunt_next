import React, {Fragment} from 'react'

const Layout = (props) => {

    return ( 

        <Fragment>

            <h1>Header</h1>

            <main>
                {props.children}
            </main>

        </Fragment>
     
    );
}
 
export default Latout;
