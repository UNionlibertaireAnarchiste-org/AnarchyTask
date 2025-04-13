import Button from '../button/Button'
import Input from '../input/Input'
import fstyle from './card.module.css'
import { useState } from 'react'

export default function Card( {valueTask, addTask, onMessage} ){
    // pour faire apparaitre input de la modification
    const [valueModif,setValueModif] = useState(false);
    // Valeur actuelle
    // const [task,setTask] = useState(valueTask);
    // Pour recuperer la valeur modifier 
    const [inputValue , setInputValue] = useState('');

    // fonction pour faire alterner input visible et invisible 
    const funcInput = (e) =>{
        e.preventDefault();
        // Pour alterner l'affichage de input 
        setValueModif(!valueModif);
        
    }
    // Pour recuperer la valeur saisie 
    const handleChange = (e) =>{
        setInputValue(e.target.value);
       
    }

    // pour modifier la tache 
    const handleModifyTask = () =>{
       

        if(onMessage){
            onMessage(inputValue);
            setInputValue('');
        }
        setValueModif(false);
    }
    

    return(
        <>
            <div key={valueTask} className={fstyle.card}>

                {/* Quand il n'y a pas de champs input  */}
                {valueModif ? (
                    <>
                       <Input valueTask={valueTask} onChange={handleChange}/> 
                       <Button text="Modifier " color="#008000" onClick={handleModifyTask} />
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