# ERREUR 
1. Quand on un **formulaire** on utilise **onChange** sur un **input**.

2. Quand on a **plusieurs** props dans **App.jsx** qui sont dans une **map** ne pas oublier de designer plusieur elements dans le bon ordre 
````
     <div className="task-list">
          {task.map( (el, index ) => (
            <Card key={index} valueTask={el} />
          ))}
        </div>

````

# Pour la modification 
## faire apparaitre le input (comùposant enfant )
1. Creer un useState avec comme valeur false 
````
const [valueModif,setValueModif] = useState(false);
````
2. On va faire un **onClick** sur le bouton modifier qui va appeller une fonction funcInput
3. Dans funcInputon va dire que input apparait quand la valeur est egale a true donc le contraire de la valeur initiale 
````
const funcInput = (e) =>{
        e.preventDefault();
        // Pour alterner l'affichage de input 
        setValueModif(!valueModif);
        
    }
````
4. Après on utilise **valueModif** du **useState** avec les conditions ternaire pour faire apparitre quand la valeur est egale a **true** le input et le faire **disparaitre** quand il est egale a **false**
````
{NomUseState ? (
  <>
    // ELEMENT DU RENDU TRUE
  </>
) : (
  <>
      // ELEMENT DU RENDU FALSE
  </>
)}

````
Exemple 

````
  {valueModif ? (
                    <>
                       <Input valueTask={valueTask} onChange={handleChange}/> 
                       <Button text="Modifier " color="#008000" onClick={handleModifyTask}  index={index}/>
                    </>
                ): (
                    <>
                      <p> {valueTask} </p>
                        <Button text="Modifier " color="#008000" onClick={funcInput} />
                        <Button text="Supprimer " color="red" />
                     
                    </>
                  )
                }
````
## Modification Tache 
### Card. jsx (composant enfant )

1. On utilise le props onMessage (qui poviens de App.jsx) dans la fonction qui est appeller par le Onclick de modifier qui s'appelle handleModifyTask  
````
 // pour modifier la tache 
    const handleModifyTask = () =>{
       

        if(onMessage){
            onMessage(inputValue,index);
            setInputValue('');
        }
        setValueModif(false);
    }
````

### App.jsx 
````
   const messageChildren = (message,index) =>{
    setInputValue(message);
    console.log(`La valeur de l'enfant est ${message} `)
    
    if(message.trim() != ""){
      // Creer un nouveau tableau 
      const newTask = [...task];
      // remplacer la valeur 
      newTask[index] = message;
      // Ajoute 
      setTask(newTask);
      setInputValue('');
    }
  }

````

````
  {task.map( (el, index ) => (
            <Card key={index} valueTask={el} addTask={funcAddTask} onMessage={messageChildren} index={index}/>
          ))}
````