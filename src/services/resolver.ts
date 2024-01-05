import { Request, Response, NextFunction } from 'express'
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize'

import { components } from '@self/types/api'
import db from '@self/database'
import auth from '@self/auth'
import logger from '@self/logging/logger'
import { BadRequest } from '@self/error-handling/httpErrors'
const DigitalLink = db.DigitalLink

type DigitalLinkFull_schema = components['schemas']['DigitalLinkFull']
type DigitalLinkURL_schema = components['schemas']['DigitalLinkURL']

const getAllEntries = async (
    _: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const codes = await DigitalLink.findAll({ raw: true })
        res.status(200).json(codes)
    } catch (err) {
        res.status(500).json(err)
    }
}

const resolveDigitalLinkByGtin = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const gtin: number = Number(req.params.gtin)
        const destinationLink = await DigitalLink.findByPk(gtin)
        if (destinationLink) {
            const destinationURL_ = destinationLink.toJSON().destinationURL

            const destinationURL: URL = new URL(
                destinationURL_.startsWith('http')
                    ? destinationURL_
                    : `https://${destinationURL_}`
            )
            destinationURL.search = new URLSearchParams(
                req.query as any
            ).toString()
            if (!destinationURL.protocol) {
                destinationURL.protocol = 'https'
            }
            res.redirect(301, destinationURL.toString())
        } else {
            res.status(404).json({
                error: 'Digital Link with this gtin does not exist',
            })
        }
    } catch (err) {
        logger.error(err)
        res.status(500).json(err)
    }
}

const resolveDigitalLinkBySerialId = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const gtin: number = Number(req.params.gtin)
        const serialId: number = Number(req.params.serialId)
        const destinationLink = await DigitalLink.findByPk(gtin)
        if (destinationLink) {
            const destinationURL_ =
                destinationLink.toJSON().destinationURL + '/' + serialId

            const destinationURL: URL = new URL(
                destinationURL_.startsWith('http')
                    ? destinationURL_
                    : `https://${destinationURL_}`
            )
            destinationURL.search = new URLSearchParams(
                req.query as any
            ).toString()
            res.redirect(301, destinationURL.toString())
        } else {
            res.status(404).json({
                error: 'Digital Link with this gtin does not exist',
            })
        }
    } catch (err) {
        logger.error(err)
        res.status(500).json(err)
    }
}

const createDigitalLink = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!auth(req, res)) return

    const body: DigitalLinkFull_schema = req.body
    const destinationURL: string = body.destinationURL
    const gtin: number = body.gtin

    try {
        const newQR = DigitalLink.build({
            gtin: gtin,
            destinationURL: destinationURL,
        })
        await newQR.save()
        res.status(201).json(newQR.toJSON())
        return
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            const msg = `Entry with gtin ${gtin} already exists.`
            logger.warn(msg)
            res.status(400).json(msg)
        } else {
            logger.error(
                `Error while creating QR code with  destinationURL ${destinationURL}.`
            )
            logger.error(err)
            res.status(500).json(err)
        }
    }
}

const deleteDigitalLinkByGtin = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (!auth(req, res)) return

    const gtin: number = Number(req.params.gtin)

    try {
        const code = await DigitalLink.findByPk(gtin)
        if (code) {
            code.destroy()
            res.status(204).send()
        } else {
            res.status(404).json({
                error: `QR code with gtin ${gtin} does not exist`,
            })
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

const updateDigitalLink = async (req: Request, res: Response) => {
    if (!auth(req, res)) return

    const gtin: string = req.params.gtin
    const body: DigitalLinkURL_schema = req.body
    const destinationURL: string = body.destinationURL

    const code = await DigitalLink.findByPk(gtin)
    if (code === null) {
        logger.info(
            `PUT request for code with ${gtin}, code with that gtin not found, creating new code.`
        )
        createDigitalLink(req, res)
    } else {
        logger.info(
            `PUT request for code with ${gtin}, code with that gtin found, updating code destinationURL.`
        )
        code.destinationURL = destinationURL
        code.save()
        res.status(204).json(code.toJSON())
    }
}

module.exports = {
    getAllEntries,
    resolveDigitalLinkByGtin,
    resolveDigitalLinkBySerialId,
    createDigitalLink,
    deleteDigitalLinkByGtin,
    updateDigitalLink,
}
