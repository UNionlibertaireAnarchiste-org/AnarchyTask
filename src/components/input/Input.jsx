import fstyle from './input.module.css'

export default function Input({onChange,valueTask} ){

    return(
        <>
            <input type="text" className={fstyle.input} onChange={onChange} defaultValue={valueTask} />
        </>
    )
}