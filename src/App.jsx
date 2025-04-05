import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Button from './components/button/Button'
import Card from './components/card/Card'
import Input from './components/input/Input'
import viteLogo from '/vite.svg'
import fstyle from './app.module.css'

function App() {

  const [task,setTask] = useState([]);

  const funcAddTask = (e) =>{
    console.log("test");
  }
  
  return (
    <>
      <div className={fstyle.main}>
        <Input />
        <Button text="Creer une tache " color="#008000" onClick={funcAddTask} />
      </div>
        
    
    </>
  )
}

export default App
