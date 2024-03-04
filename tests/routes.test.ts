import request from 'supertest'
import app from '@self/app'
import db from '@self/database'
import config from '@self/environment'

const dlSpecifiers = ['01', '99']

describe('Test routes', () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true, match: /^testDb$/ })
    })

    test('List entries, empty db', async () => {
        for (let dls of dlSpecifiers) {
            const res = await request(app).get(`/${dls}`)
            expect(res.body).toEqual([])
        }
    })

    test('Test create, auth OK', async () => {
        let res

        for (let dls of dlSpecifiers) {
            res = await request(app)
                .post(`/${dls}`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', config.auth_token as string)
                .send('{"gtin": 1, "destinationURL":"google.com"}')
            expect(res.status).toEqual(201)
            expect(res.body.destinationURL).toEqual('google.com')

            res = await request(app)
                .post(`/${dls}`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', config.auth_token as string)
                .send('{"gtin": 24, "destinationURL":"gmail.com"}')
            expect(res.status).toEqual(201)
            expect(res.body.destinationURL).toEqual('gmail.com')

            res = await request(app)
                .post(`/${dls}`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', config.auth_token as string)
                .send(
                    '{"gtin": 999999999999999, "destinationURL":"tagshaper.com"}'
                )
            expect(res.status).toEqual(201)
            expect(res.body.destinationURL).toEqual('tagshaper.com')
        }
    })

    test('Test create duplicate', async () => {
        let res

        for (let dls of dlSpecifiers) {
            res = await request(app)
                .post(`/${dls}`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', config.auth_token as string)
                .send('{"gtin": 1, "destinationURL":"google.com"}')
            expect(res.status).toEqual(400)
        }
    })

    test('Test resolve by gtin only', async () => {
        for (let dls of dlSpecifiers) {
            const res = await request(app)
                .get(`/${dls}/1?1=2&a=b&query=test`)
                .set('Content-Type', 'application/json')
                .send()
            expect(res.status).toEqual(301)
            expect(res.headers['location']).toMatch(
                'https://google.com/?1=2&a=b&query=test'
            )
        }
    })

    test('Test resolve by gtin and serialId', async () => {
        for (let dls of dlSpecifiers) {
            const res = await request(app)
                .get(`/${dls}/1/21/123?1=2&a=b&query=test`)
                .set('Content-Type', 'application/json')
                .send()
            expect(res.status).toEqual(301)
            expect(res.headers['location']).toMatch(
                'https://google.com/123?1=2&a=b&query=test'
            )
        }
    })

    test('Test modify, auth OK', async () => {
        for (let dls of dlSpecifiers) {
            let res = await request(app)
                .put(`/${dls}/1`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', config.auth_token as string)
                .send('{"destinationURL":"modified.com"}')

            expect(res.status).toEqual(200)
            expect(res.body.destinationURL).toEqual("modified.com");

            res = await request(app).get(`/${dls}`)
            const code : any = res.body.find( (c : any) => c.gtin)
            expect(code?.destinationURL).toEqual("modified.com")
        }
    })

    test('Test create, auth NOK', async () => {
        for (let dls of dlSpecifiers) {
            const res = await request(app)
                .post(`/${dls}`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', 'wrong-token')
                .send('{"gtin": 3, "destinationURL":"tagshaper.com"}')
            expect(res.status).toEqual(401)
        }
    })

    test('Test modify, auth NOK', async () => {
        for (let dls of dlSpecifiers) {
            const res = await request(app)
                .put(`/${dls}/1`)
                .set('Content-Type', 'application/json')
                .set('X-API-KEY', 'wrong-token')
                .send('{"destinationURL":"tagshaper.com"}')
            expect(res.status).toEqual(401)
        }
    })

    test('Test delete auth NOK', async () => {
        for (let dls of dlSpecifiers) {
            const res = await request(app)
                .delete(`/${dls}/1`)
                .set('X-API-KEY', 'wrong-token')
                .send()
            expect(res.status).toEqual(401)
        }
    })

    test('Test delete auth OK', async () => {
        let res

        for (let dls of dlSpecifiers) {
            res = await request(app)
                .delete(`/${dls}/1`)
                .set('X-API-KEY', config.auth_token as string)
                .send()
            expect(res.status).toEqual(204)

            res = await request(app).get(`/${dls}`)
            expect(res.body.length).toEqual(2)
            expect(res.body[0].destinationURL).toEqual('gmail.com')
        }
    })

    afterAll(async () => {
        await db.sequelize.close()
    })
})
