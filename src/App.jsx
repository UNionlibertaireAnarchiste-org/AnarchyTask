import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Button from './components/button/Button'
import Card from './components/card/Card'
import Input from './components/input/Input'
import viteLogo from '/vite.svg'
// import fstyle from './app.module.css'
import './app.css'

function App() {
  // tableau pour ajouter les taches 
  const [task,setTask] = useState([]);
  // Pour gerer la valeur de l'input 
  const [inputValue , setInputValue] = useState('');
  // Pour recuperer la valeur de input de l'enfant 
  // const [inputValueChild,setInputValueChild] = useState('');
 
  const funcAddTask = (e) =>{
    // console.log("test");
    e.preventDefault();

    if(inputValue.trim() != ""){
      setTask( [...task,inputValue] );
      setInputValue('');
    }
 
  }

  // Fonction pour recuperer la valeur saisie 
  const handleInputChange = (e) =>{
    setInputValue(e.target.value);
  }

  // FONCTION POUR RECUPERER LA VALEUR DE L'ENFANT 
  const messageChildren = (message) =>{
    setInputValue(message);
    console.log(`La valeur de l'enfant est ${message} `)
    // console.log(`apres : ${inputValue} `)
    if(message.trim() != ""){
      setTask( [...task,message] );
      console.log(`cela fonctionne ${task} `);
    }
  }
  
  return (
    <>
      <div className="main">
        <form >
          {/* onChange = indispensable pour rendre les formulaire interactif avec react  */}
          <Input onChange={handleInputChange} />
          <Button text="Creer une tache " color="#008000" onClick={funcAddTask} />
        </form>
        
      </div>

      {/* ATTENTION ne pas oubleir de preciser les elements apres map quand il a plusieurs props  */}
      <div className="task-list">
          {task.map( (el, index ) => (
            <Card key={index} valueTask={el} addTask={funcAddTask} onMessage={messageChildren}/>
          ))}
      </div>

      
        
    
    </>
  )
}

export default App
