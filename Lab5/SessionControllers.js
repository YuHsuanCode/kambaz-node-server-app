export default function SessionController(app){
    const setSession = (req, res) => {
        const name = req.params["name"];
        const value = req.params["value"];
        req.session[name] = value;//store this info to the session
        res.send(req.session);
    };
    app.get("/api/session/set/:name/:value", setSession);

    const getSession = (req,res) => {
        const name = req.params["name"];
        const value = req.session[name];//use it as an entry into the map to retrieve the data
        res.send(value);
    };
    app.get("/api/session/get/:name/:value", getSession);

    //only the specific
    const resetSession = (req, res) =>{
        req.session.destroy();
        res.send(200);
    };
    app.get("/api/session/reset", resetSession);

    const getSessionAll = (req,res) => {
        res.send(req.session);
    };
    app.get("/api/session", getSessionAll);
}