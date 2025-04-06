import Button from '../button/Button'
import Input from '../input/Input'

export default function Card( {valueTask} ){

    return(
        <>
            <div key={valueTask}>
                <p> {valueTask} </p>
                <Button text="Modifier " color="#008000" />
                <Button text="Supprimer " color="red" />
            </div>
        </>
    )
}