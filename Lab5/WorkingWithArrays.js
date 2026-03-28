//SERVER
const todos = [
    {id: 1, title: "Task 1", completed: false, description:"Create a NodeJS server with ExpressJS"},
    {id: 2, title: "Task 2", completed: true, description:"Create a NodeJS server"},
    {id: 3, title: "Task 3", completed: false, description:"Create a NodeJS server by ExpressJS"},
    {id: 4, title: "Task 4", completed: true, description:"Create a NodeJS server uses ExpressJS"}, ];

export default function WorkingWithArrays(app){
    /*
    app.get("/lab5/todos", (req,res) => {
        res.json(todos);
    });
    */

    // create new data
    app.get("/lab5/todos/create", (req,res) => {
        const newTodo = {id: new Date().getTime(),title: "New Task",completed: false,};
        todos.push(newTodo);
        res.json(todos);
    });
    // HTTP POST method = create, but only responds with new created todo object
    app.post("/lab5/todos", (req,res)=>{
        const newTodo = {...req.body, id: new Date().getTime()};
        todos.push(newTodo);
        res.json(newTodo);
    });

    //primary key -- ID
    app.get("/lab5/todos/:id", (req,res) => {
        const {id} = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        res.json(todo);
    });

    //query string -- completed properties
    app.get("/lab5/todos", (req,res) => {
        const {completed} = req.query;
        if(completed !== undefined) {
            const completedBool = completed === "true";
            const completedTodos = todos.filter(
                (t) => t.completed === completedBool);
            res.json(completedTodos);
            return;
        }
        res.json(todos);
    });

    //delete
    app.get("/lab5/todos/:id/delete", (req,res)=>{
        const {id} = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if(todoIndex !== -1) {
            todos.splice(todoIndex, 1);//remove one item at the found index
        }
        res.json(todos);
    });

    //HTTP DELETE
    app.delete("/lab5/todos/:id", (req, res) => {
        const {id} = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        // throws exceptions if the items being deleted or updated don't actually exist.
        if(todoIndex === -1) {
            res.status(404).json({message: `Unable to delete Todo with ID ${id}`});
            return;
        }
        todos.splice(todoIndex, 1);
        res.sendStatus(200); // only respond with a success status
    });

    //update
    app.get("/lab5/todos/:id/title/:title", (req, res)=> {
        const { id, title } = req.params;
        const todo = todos.find((t)=> t.id === parseInt(id));
        todo.title = title;
        res.json(todos);
    });
    
    //update complete
    app.get("/lab5/todos/:id/completed/:completed", (req,res) => {
        const {id, completed} = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.completed = completed;
        res.json(todos);
    });

    //update description
    app.get("/lab5/todos/:id/description/:description", (req,res) => {
        const {id, description} = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.description = description;
        res.json(todos);
    });

    //HTTP PUT
    app.put("/lab5/todos/:id", (req, res) =>{
        const {id} = req.params;
        const todoIndex = todos.findIndex((t)=> t.id === parseInt(id));
        if(todoIndex === -1){
            res.status(404).json({message:`Unable to update Todo with ID ${id}` });
            return;
        }
        const idNum = parseInt(id);
        const idx = todos.findIndex((t) => t.id === idNum);
        todos[idx] = { ...todos[idx], ...req.body };
        res.sendStatus(200);
    })
};