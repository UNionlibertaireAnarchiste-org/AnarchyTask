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