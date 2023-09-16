import {components} from "@self/types/api";
import {Request, Response} from 'express';

type QR = components["schemas"]["QR"];
type QRInput = components["schemas"]["QRInput"];


const getQRCode =  async (req: Request, res: Response) => {
   console.log("hi");
   res.status(200).json({"msg": "here is qr code"});
}



const createQRCode =  async (req: Request, res: Response) => {
   res.status(200).json({"msg": "QR code created"});
}



module.exports = {
    getQRCode,
    createQRCode
}






/*
app.post("/articles", (req: Request, res: Response) => {
  const articleInput: ArticleInput = req.body;
  const newArticle: Article = { ...articleInput, id: "1" };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});
*/
