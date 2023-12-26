import {Request, Response} from 'express';

import {components} from "@self/types/api";
import db from "@self/database";
import auth from "@self/auth";
const entry = db.entry;


type EntryUrl_schema = components["schemas"]["EntryUrl"];



const getAllEntries =  async (_: Request, res: Response): Promise<void> => {
    try{
        const codes = await entry.findAll({raw: true});
        res.status(200).json(codes);
    }
     catch (err) {
        res.status(500).json(err);
    }
}


const resolveEntryById =  async (req: Request, res: Response): Promise<void> => {
    try{
        const id: number = Number(req.params.id);
        const code = await entry.findByPk(id);
        if (code){
            let url: string = code.toJSON().url;
            if (!url.startsWith("https://")){
                if(!url.startsWith("http://")){
                    url = "https://" + url;
                } else {
                    url = url.replace("http", "https");
                }
            }
            res.redirect(301, url);
        } else {
            res.status(404).json({error: "QR code with this id does not exist"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
}



const createEntry =  async (req: Request, res: Response): Promise<void> => {
    if (! auth(req, res) )
        return;

    const body: EntryUrl_schema = req.body;
    const url: string = body.url;

    try {
        const newQR = entry.build({"url": url});
        await newQR.save();
        res.status(201).json(newQR.toJSON());
        return;
    } catch (err) {
        console.log(`Error while creating QR code with  url ${url}.`);
        console.log(err);
        res.status(500).json(err);
    }

}



const deleteEntryById =  async (req: Request, res: Response): Promise<void> => {
    if (! auth(req, res) )
        return;

    const id: number = Number(req.params.id);

    try{
        const code = await entry.findByPk(id);
        if (code){
            code.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({error: `QR code with id ${id} does not exist`});
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateEntry =  async (req: Request, res: Response) => {
    if (! auth(req, res) )
        return;

    const id: string  = req.params.id;
    const body: EntryUrl_schema = req.body;
    const url: string = body.url;

    const code = await entry.findByPk(id);
    if (code === null) {
      console.log(`PUT request for code with ${id}, code with that id not found, creating new code.`); 
      createEntry(req, res);
    } else {
      console.log(`PUT request for code with ${id}, code with that id found, updating code url.`); 
      code.url = url;
      code.save();
      res.status(204).json(code.toJSON());
    }
}

module.exports = {
    getAllEntries,
    resolveEntryById,
    createEntry,
    deleteEntryById,
    updateEntry
}






/*
app.post("/articles", (req: Request, res: Response) => {
  const articleInput: ArticleInput = req.body;
  const newArticle: Article = { ...articleInput, id: "1" };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});
*/
