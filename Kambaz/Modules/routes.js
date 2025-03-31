import * as modulesDao from "./dao.js";
import db from "../Database/index.js";

export default function ModuleRoutes(app){
    app.post("/api/courses/:cid/modules", (req,res) => {
        const {cid} = req.params;
        const newModule = {
            ...req.body,
            course: cid,
            _id: new Date().getTime().toString(),
        };
        db.modules.push(newModule);
        res.send(newModule);
    });

    app.get("/api/courses/:cid/modules", (req,res) => {
        const {cid} = req.params;
        const modules = db.modules.filter((m) => m.course === cid);
        res.json(modules);
    });

    app.delete("/api/modules/:moduleId", async(req,res) => {
        const {moduleId} = req.params;
        const status = await modulesDao.deleteMosule(moduleId);
        res.send(status);
    });

    app.put("/api/modules/:moduleId", async (req, res)=> {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const status = await modulesDao.updateModule(moduleId, moduleUpdates);
        res.send(status);
    });
   
}