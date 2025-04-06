import Button from '../button/Button'
import Input from '../input/Input'

export default function Card( {valueTask} ){

    return(
        <>
            <div key={valueTask}>
                <p> {valueTask} </p>
            </div>
        </>
    )
}