import React, {useState} from "react"
import ResourcesList from './resourceslist';




export default function Resources() {
  // Sample initial resource values
  const [resources, setResources] = useState({
    gold: 100,
    wood: 50,
    iron: 75,
    lithium: 20,
    uranium: 10,
    wheat: 120,
    energy: 200,
    humans: 500,
  });

  return (
   
        <ResourcesList resources={resources} /> 
   
  );
}
