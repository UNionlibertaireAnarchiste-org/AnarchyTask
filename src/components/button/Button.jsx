import fstyle from './button.module.css'

export default function Button({text,color}){
    
    return(
        <>
            <button className={fstyle.button} style={{backgroundColor:color}}>
                    {text}
            </button>
        </>
    )
}