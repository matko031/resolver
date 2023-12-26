import request from "supertest";

import app from "@self/app";
import db from '@self/database';

describe("Test routes", () => {
    beforeAll(async () => {
        process.env.PORT="3001";
        process.env.DATABASE_NAME="devDb";
        process.env.DATABASE_USERNAME="root";
        process.env.DATABASE_PASSWORD="root";
        process.env.DATABASE_HOST="localhost";
        process.env.DATABASE_DIALECT="mysql";
        process.env.AUTH_TOKEN="development_token";
        process.env.NODE_ENV="test";
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
        .send('{"url":"google.com"}')
    expect(res.status).toEqual(201);
    expect(res.body.url).toEqual('google.com');

    res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send('{"url":"gmail.com"}')
    expect(res.status).toEqual(201);
    expect(res.body.url).toEqual('gmail.com');

  });

  test("List entries, non empty db", async () => {
    const res = await request(app).get("/");
    expect(res.body[0].url).toEqual('google.com');
    expect(res.body[1].url).toEqual('gmail.com');
  });

  test("Test modify, auth OK", async () => {
    let res;
    res = await request(app)
        .put("/1")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send('{"url":"tagshaper.com"}')
    expect(res.status).toEqual(204);

    res = await request(app).get("/");
    expect(res.body[0].url).toEqual('tagshaper.com');
  });

  test("Test resolve", async () => {
    const res = await request(app)
        .get("/1")
        .set('Content-Type', 'application/json')
        .send()
    expect(res.status).toEqual(301);
    expect(res.headers["location"]).toMatch('https://tagshaper.com');
  });

  test("Test create, auth NOK", async () => {
    const res = await request(app)
        .post("/")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', "wrong-token")
        .send('{"url":"tagshaper.com"}')
    expect(res.status).toEqual(401);
  });

  test("Test modify, auth NOK", async () => {
    const res = await request(app)
        .put("/1")
        .set('Content-Type', 'application/json')
        .set('X-API-KEY', "wrong-token")
        .send('{"url":"tagshaper.com"}')
    expect(res.status).toEqual(401);
  });

  test("Test delete auth NOK", async () => {
    const res = await request(app)
        .delete("/1")
        .set('X-API-KEY', "wrong-token")
        .send()
    expect(res.status).toEqual(401);
  });

  test("Test delete auth OK", async () => {
    let res;

    res = await request(app)
        .delete("/1")
        .set('X-API-KEY', process.env.AUTH_TOKEN as string)
        .send()
    expect(res.status).toEqual(204);

    res = await request(app).get("/");
    expect(res.body.length).toEqual(1);
    expect(res.body[0].url).toEqual('gmail.com');
  });


  afterAll( async () => {
    await db.sequelize.close();
  })
});
