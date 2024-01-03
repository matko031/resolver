import { Request, Response } from 'express'
import path from 'path'

module.exports = {
    serveDocs: (req: Request, res: Response) => {
        try {
            res.status(200).sendFile(
                path.join(
                    __dirname,
                    '..',
                    '..',
                    'specs',
                    'public',
                    'index.html'
                )
            )
            // res.status(200).send("ok");
        } catch (e) {
            res.status(500).json({
                errors: [
                    {
                        message: 'Failed to serve documentation.',
                    },
                ],
            })
        }
    },
}
