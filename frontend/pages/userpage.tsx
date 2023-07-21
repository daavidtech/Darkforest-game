import React, {useState} from "react"

import style from  '../styles/Home.module.css';


var user = "anonyymimies"


export default function userpage(){

	return(
	
	
	
	<div  >
            
            
		<nav className={style.gamenav} 
				
			>
			<a href="/resources">resources</a>
			
			
			<a href="/settlement ">settlement</a>
			
			<a href="/map">map</a>
		  
			<a href="0">User:{user}</a>
		</nav>
		
		
	</div>)
	

}