import Button from '../button/Button'
import Input from '../input/Input'
import fstyle from './card.module.css'

export default function Card( {valueTask} ){

    return(
        <>
            <div key={valueTask} className={fstyle.card}>
                <p> {valueTask} </p>
                <Button text="Modifier " color="#008000" />
                <Button text="Supprimer " color="red" />
            </div>
        </>
    )
}