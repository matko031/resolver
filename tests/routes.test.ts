import request from "supertest";
import app from "@self/app";
import db from '@self/database';

describe("Test routes", () => {
    beforeAll(async () => {
        await db.sequelize.sync({force: true, match: /^testDb$/})
    });

  test("List entries, empty db", async () => {
    const res = await request(app).get("/");
    expect(res.body).toEqual([]);
  });


  test("Test create, auth OK", async () => {
    let res;

    res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send('{"gtin": 1, "destinationURL":"google.com"}')
    expect(res.status).toEqual(201);
    expect(res.body.destinationURL).toEqual('google.com');

    res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send('{"gtin": 24, "destinationURL":"gmail.com"}')
    expect(res.status).toEqual(201);
    expect(res.body.destinationURL).toEqual('gmail.com');

    res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send('{"gtin": 999999999999999, "destinationURL":"tagshaper.com"}')
    expect(res.status).toEqual(201);
    expect(res.body.destinationURL).toEqual('tagshaper.com');

  });

  test("Test create duplicate", async () => {
    let res;

    res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send('{"gtin": 1, "destinationURL":"google.com"}')
    expect(res.status).toEqual(400);
  });

  test("Test resolve", async () => {
    const res = await request(app)
        .get("/01/1")
        .set('Content-Type', 'application/json')
        .send()
    expect(res.status).toEqual(301);
    expect(res.headers["location"]).toMatch('https://google.com');
  });

  test("Test create, auth NOK", async () => {
    const res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', "wrong-token")
        .send('{"gtin": 3, "destinationURL":"tagshaper.com"}')
    expect(res.status).toEqual(401);
  });

  test("Test modify, auth NOK", async () => {
    const res = await request(app)
        .put("/01/1")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', "wrong-token")
        .send('{"destinationURL":"tagshaper.com"}')
    expect(res.status).toEqual(401);
  });

  test("Test delete auth NOK", async () => {
    const res = await request(app)
        .delete("/01/1")
        .set('X-API-KEY', "wrong-token")
        .send()
    expect(res.status).toEqual(401);
  });

  test("Test delete auth OK", async () => {
    let res;

    res = await request(app)
        .delete("/01/1")
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send()
    expect(res.status).toEqual(204);

    res = await request(app).get("/");
    expect(res.body.length).toEqual(2);
    expect(res.body[0].destinationURL).toEqual('gmail.com');
  });


  afterAll( async () => {
    await db.sequelize.close();
  })
});
