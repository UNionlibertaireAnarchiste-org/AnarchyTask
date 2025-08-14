import fstyle from './input.module.css'

export default function Input({ onChange, value, placeholder, autoFocus, onKeyDown, disabled = false, type = "text", id, name }) {
    return (
        <input 
            type={type}
            id={id}
            name={name}
            className={fstyle.input} 
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            disabled={disabled}
        />
    )
}