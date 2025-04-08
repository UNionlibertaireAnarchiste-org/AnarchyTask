import Button from '../button/Button'
import Input from '../input/Input'
import fstyle from './card.module.css'
import { useState } from 'react'

export default function Card( {valueTask} ){

    const [valueModif,setValueModif] = useState(false);

    const funcInput = (e) =>{
        e.preventDefault();
        // Pour alterner l'affichage de input 
        setValueModif(!valueModif);
    }

    return(
        <>
            <div key={valueTask} className={fstyle.card}>
                
                {/* Affiche dans le nom de la tache quand il n'y a pas de champs input  */}
                {!valueModif && <p>{valueTask}</p> }
                
                {valueModif && <Input valueTask={valueTask}/>}

                <Button text="Modifier " color="#008000" onClick={funcInput} />
                {/* Quand il n'y a pas l'input modifier */}
                {!valueModif &&  <Button text="Supprimer " color="red" /> }
                
                
            </div>
        </>
    )
}