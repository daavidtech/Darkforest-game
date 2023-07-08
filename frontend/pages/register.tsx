import React, { useState } from "react"
import { gql, useMutation } from '@apollo/client';





const UPDATE_REGISTER= gql`
  
mutation UPDATE_REGISTER($email: String!, $username:String!, $password: String!)  {
  register(email: $email, username: $username, password: $password) {
    username
  }
}
`;


export default function Register() {
  

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email ,setEmail] = useState('')
  
  
 
  const handleUsernameChange = event => { 
    setUsername(event.target.value);
  };

  const haddleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };
  


  const [register, {loading, error }] = useMutation(UPDATE_REGISTER);

  const handleRegister = (event) => {
    event.preventDefault()
    register({
      variables:{

        email: email,
        username: username,
        password: password
      }
    }) .catch(error => {
      
      console.error(error);
    });
  }


  
  if (loading) return 'Submitting...';
  if (error) return `username or email taken! ${error.message}`;

 

 
  return (
   
    <main >
       
      <div >
      

          <h1>offensive gaming</h1>
        
      </div>

      



      <div>
        <h1 >register</h1>
        <form  onSubmit={
          
         handleRegister
          
        }>
          <input 
            type="username" value={username} onChange={handleUsernameChange} 
            />
          <input
           type="email" value={email} onChange={haddleEmailChange}
            
          />
          <input
            type="password" value={password} onChange={handlePasswordChange}
            
          />

        
          <button type="submit">Register</button>
        </form>
      </div>

      <div> 

          <h1>Darkforest</h1>
        
      </div>

      
    </main>
    
  )
}

