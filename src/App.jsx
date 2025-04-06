import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Button from './components/button/Button'
import Card from './components/card/Card'
import Input from './components/input/Input'
import viteLogo from '/vite.svg'
import fstyle from './app.module.css'

function App() {
  // tableau pour ajouter les taches 
  const [task,setTask] = useState([]);
  // Pour gerer la valeur de l'input 
  const [inputValue , setInputValue] = useState('');
 
  const funcAddTask = (e) =>{
    // console.log("test");
    e.preventDefault();

    if(inputValue.trim() != ""){
      setTask( [...task,inputValue] );
      setInputValue('');
    }

    

    
  }

  // Fonction pour recuperer la valeur 
  const handleInputChange = (e) =>{
    setInputValue(e.target.value);
  }
  
  return (
    <>
      <div className={fstyle.main}>
        <form >
          {/* onChange = indispensable pour rendre les formulaire interactif avec react  */}
          <Input onChange={handleInputChange} />
          <Button text="Creer une tache " color="#008000" onClick={funcAddTask} />
        </form>
        
        
        {/* ATTENTION ne pas oubleir de preciser les elements apres map quand il a plusieurs props  */}
        <div className="task-list">
          {task.map( (el, index ) => (
            <Card key={index} valueTask={el} />
          ))}
        </div>

       
        
       
      </div>

      
        
    
    </>
  )
}

export default App
