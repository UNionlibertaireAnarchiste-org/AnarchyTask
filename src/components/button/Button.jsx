import fstyle from './button.module.css'

export default function Button({text,color,onClick}){
    
    return(
        <>
            <button className={fstyle.button} style={{backgroundColor:color}} onClick={onClick}>
                    {text}
            </button>
        </>
    )
}