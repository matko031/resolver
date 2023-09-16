"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getQRCode = async (req, res) => {
    console.log("hi");
    res.status(200).json({ "msg": "here is qr code" });
};
const createQRCode = async (req, res) => {
    res.status(200).json({ "msg": "QR code created" });
};
module.exports = {
    getQRCode,
    createQRCode
};
/*
app.post("/articles", (req: Request, res: Response) => {
  const articleInput: ArticleInput = req.body;
  const newArticle: Article = { ...articleInput, id: "1" };

  articles.push(newArticle);
  res.status(201).json(newArticle);
});
*/
//# sourceMappingURL=qr.js.map