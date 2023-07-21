import React from "react"

import style from  '../styles/Home.module.css';
import { gql, useMutation, useQuery } from "@apollo/client";


const VIEWER_QUERY = gql`
query{
    viewer{
        user{
            username
        }
    }
}
`
;




export const Layout = ({ children }) => {
    const {loading, error, data} = useQuery(VIEWER_QUERY);
    if(loading) return 'loading'
    if (error) return `Error! ${error.message}`;

    var user = "anonyymimies"
  
   
    return (
        <div >
            
            
            <nav className={style.nav}
                    
                >
                <a href="/home">Home</a>
                
                
                <a href="/register">Register</a>
                
                <a href="/sign">sign</a>
               
                <a href="0">User:{user}</a>
            </nav>
            {children}
            
        </div>
    )
}