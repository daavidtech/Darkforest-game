import React, {useState} from "react"
import style from  '../styles/Home.module.css';

import Resources from "./resources";
import Setlement from "./setlement";

var user = "anonyymimies"




function userpage() {



  return (
    <div className={style.parent} >
        <Resources/>
		<Setlement />
	

    </div>
  );
}

export default userpage;