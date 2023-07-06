import { gql, useMutation } from "@apollo/client"
import React, {useState} from "react"



const LOG_IN= gql`
  
mutation LOG_IN($username:String!, $password: String!)  {
  login(username: $username, password: $password) {
    username
  }
}
`;



export default function Login() {

  
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const [login, {loading, error} ] = useMutation(LOG_IN)


  if (loading) return 'Submitting...';
  if (error) return `wrong user name or password ${error.message}`;

  const handleLogin = (event) => {
    console.log(`Käyttäjätunnus: ${username}, Salasana: ${password}`);
    event.preventDefault();
    
    login({
      variables:{
        username:username,
        password:password
      }
    }).catch(error => {
      
      console.error(error);
    });
   
  };
  
  return (
    
      <main >
        <div >
  
            
          
        </div>
  
    
        <div>
          <h1 >sign</h1>
          <form onSubmit={handleLogin}>
          
          <input 
          type="username" 
          value={username} 
          onChange={handleUsernameChange} />
            
            <input
             type="password" 
            value={password}
             onChange={handlePasswordChange}
             />
            
            <button type="submit">Kirjaudu sisään</button>
           
          </ form>
        </div>
  
        <div> 
  
            <h1>Darkforest</h1>
          
        </div>
  
    
      </main>
    )
  }
  
  