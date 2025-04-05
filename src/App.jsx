import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Button from './components/button/Button'
import Card from './components/card/Card'
import Input from './components/input/Input'
import viteLogo from '/vite.svg'
import fstyle from './app.module.css'

function App() {

  const [task,setTask] = useState([]);
  // Pour gerer la v aleur de l'input 
  const [inputValue , setInputValue] = useState('');
 
  const funcAddTask = (e) =>{
    // console.log("test");
    e.preventDefault();
    let values = e.target.value;
    // console.log(values);
    setTask([...task,values]);

    
     console.log(task);

    
  }

  
  
  return (
    <>
      <div className={fstyle.main}>
        <Input />
        <Button text="Creer une tache " color="#008000" onClick={funcAddTask} />
      </div>

      <div>
        <h2>Tâches :</h2>
        <ul>
          {task.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
        
    
    </>
  )
}

export default App
