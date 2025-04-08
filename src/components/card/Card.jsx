import Button from '../button/Button'
import Input from '../input/Input'
import fstyle from './card.module.css'
import { useState } from 'react'

export default function Card( {valueTask} ){

    const [valueModif,setValueModif] = useState(false);
    const [task,setTask] = useState([]);
    const [inputValue , setInputValue] = useState('');

    const funcInput = (e) =>{
        e.preventDefault();
        // Pour alterner l'affichage de input 
        setValueModif(!valueModif);
        console.log(valueTask)
    }

    const handleChange = (e) =>{
        setInputValue(e.target.value);
    }

    const funcAddTask = ()=>{
        
    }

    return(
        <>
            <div key={valueTask} className={fstyle.card}>

                {/* Quand il n'y a pas de champs input  */}
                {valueModif ? (
                    <>
                       <Input valueTask={valueTask} onChange={handleChange}/> 
                       <Button text="Modifier " color="#008000" onClick={funcAddTask} />
                    </>
                ): (
                    <>
                      <p> {valueTask} </p>
                        <Button text="Modifier " color="#008000" onClick={funcInput} />
                        <Button text="Supprimer " color="red" />
                     
                    </>
                  )
                }

             
                
                
            </div>
        </>
    )
}