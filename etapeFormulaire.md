# Etape pour recuperer la valeur saisie d'un utilisateur d'un formulaire 

1. Creer le formulaire 

2. creation de **2 useState()** \
    2.1. useState => **tableau**
    ````
    const [task,setTask] = useState([]);
    ````
    2.2 => useState => **valeur de l'input** => vide au debut
    ````
    const [inputValue , setInputValue] = useState('');
    ````

3. utilisation de **onChange()** sur input 


**OnChange** est une methode clé pour **interragir avec les entrer, les insertion des utilisateur** et **mettre a jours l'état** . onChange se **declenche** quand un utilisateur modifie **la valeur d'un formulaire** 

