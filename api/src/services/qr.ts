import {Request, Response} from 'express';

import {components} from "@self/types/api";
import db from "@self/database";
const QR_code = db.QR_code;


type QR_code_schema = components["schemas"]["QR"];
type QRInput_schema = components["schemas"]["QRInput"];



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
        const code = await QR_code.findByPk(req.params.qrcodeId);
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
    const body: QRInput_schema = req.body;
    try{
        const newQR = await QR_code.create({"url": body.url});
        res.status(201).json(newQR.toJSON());
    } catch (err) {
        res.status(500).json(err);
    }
}


const deleteQRCodeById =  async (req: Request, res: Response): Promise<void> => {
    try{
        const code = await QR_code.findByPk(req.params.qrcodeId);
        if (code){
            code.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({error: "QR code with this id does not exist"});
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateQRCode =  async (req: Request, res: Response) => {}

module.exports = {
    getAllQRCodes,
    getQRCodeById,
    createQRCode,
    deleteQRCodeById
}






/*
app.post("/articles", (req: Request, res: Response) => {
  const articleInput: ArticleInput = req.body;
  const newArticle: Article = { ...articleInput, id: "1" };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});
*/
