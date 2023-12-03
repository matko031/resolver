import {Request, Response} from 'express';

import {components} from "@self/types/api";
import db from "@self/database";
import auth from "@self/auth";
const QR_code = db.QR_code;


type QRurl_schema = components["schemas"]["QRurl"];



const getAllQRCodes =  async (req: Request, res: Response): Promise<void> => {
    try{
        const codes = await QR_code.findAll({raw: true});
        res.status(200).json(codes);
    }
     catch (err) {
        res.status(500).json(err);
    }
}


const getQRCodeById =  async (req: Request, res: Response): Promise<void> => {
    try{
        const id: number = Number(req.params.codeId);
        const code = await QR_code.findByPk(id);
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



const createQRCode =  async (req: Request, res: Response): Promise<void> => {
    if (! auth(req, res) )
        return;

    const body: QRurl_schema = req.body;
    const url: string = body.url;

    try {
        const newQR = QR_code.build({"url": url});
        await newQR.save();
        res.status(201).json(newQR.toJSON());
        return;
    } catch (err) {
        console.log(`Error while creating QR code with  url ${url}.`);
        console.log(err);
        res.status(500).json(err);
    }

}



const deleteQRCodeById =  async (req: Request, res: Response): Promise<void> => {
    if (! auth(req, res) )
        return;

    const id: number = Number(req.params.codeId);

    try{
        const code = await QR_code.findByPk(id);
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

const updateQRCode =  async (req: Request, res: Response) => {
    if (! auth(req, res) )
        return;

    const id: string  = req.params.codeId;
    const body: QRurl_schema = req.body;
    const url: string = body.url;

    const code = await QR_code.findByPk(id);
    if (code === null) {
      console.log(`PUT request for code with ${id}, code with that id not found, creating new code.`); 
      createQRCode(req, res);
    } else {
      console.log(`PUT request for code with ${id}, code with that id found, updating code url.`); 
      code.url = url;
      code.save();
      res.status(201).json(code.toJSON());
    }
}

module.exports = {
    getAllQRCodes,
    getQRCodeById,
    createQRCode,
    deleteQRCodeById,
    updateQRCode
}






/*
app.post("/articles", (req: Request, res: Response) => {
  const articleInput: ArticleInput = req.body;
  const newArticle: Article = { ...articleInput, id: "1" };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});
*/
