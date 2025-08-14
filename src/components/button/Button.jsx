import fstyle from './button.module.css'

export default function Button({text, color, onClick, disabled = false, type = "button"}){
    
    return(
        <>
            <button 
                type={type}
                className={fstyle.button} 
                style={{backgroundColor: disabled ? '#666' : color}} 
                onClick={onClick}
                disabled={disabled}
            >
                {text}
            </button>
        </>
    )
}