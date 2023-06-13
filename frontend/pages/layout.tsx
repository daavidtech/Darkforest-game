import React from "react"

export const Layout = ({ children }) => {
    return (
        <div>
            
            
            <nav style={{
                    fontSize: 60
                }}>
                <a href="/" >Home</a>
                
                
                <a href="/register" >Register</a>
                
                <a href="/sign">sign</a>
            </nav>
            {children}
            
        </div>
    )
}