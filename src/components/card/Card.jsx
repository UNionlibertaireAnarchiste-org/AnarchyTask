import Button from '../button/Button'
import Input from '../input/Input'
import fstyle from './card.module.css'
import { useState } from 'react'

export default function Card({ task, onUpdate, onDelete, onToggle }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(task.text);

    const handleEdit = () => {
        setIsEditing(true);
        setEditValue(task.text);
    }

    const handleSave = () => {
        if (editValue.trim()) {
            onUpdate(task.id, editValue);
            setIsEditing(false);
        }
    }

    const handleCancel = () => {
        setIsEditing(false);
        setEditValue(task.text);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }

    return (
        <div className={`${fstyle.card} ${task.completed ? fstyle.completed : ''}`}>
            <div className={fstyle.taskContent}>
                <input 
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className={fstyle.checkbox}
                />
                
                {isEditing ? (
                    <div className={fstyle.editMode}>
                        <Input 
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            autoFocus
                        />
                        <div className={fstyle.editButtons}>
                            <Button text="✊" color="#2d5016" onClick={handleSave} />
                            <Button text="🚫" color="#6c757d" onClick={handleCancel} />
                        </div>
                    </div>
                ) : (
                    <div className={fstyle.taskText}>
                        <span className={task.completed ? fstyle.completedText : ''}>
                            {task.text}
                        </span>
                        <small className={fstyle.timestamp}>
                            {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                        </small>
                    </div>
                )}
            </div>

            {!isEditing && (
                <div className={fstyle.actions}>
                    <Button text="✏️" color="#ff6b35" onClick={handleEdit} />
                    <Button text="💥" color="#8b0000" onClick={() => onDelete(task.id)} />
                </div>
            )}
        </div>
    )
}