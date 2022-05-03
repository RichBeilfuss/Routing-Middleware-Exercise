process.env.NODE_ENV = "test";

const { hasUncaughtExceptionCaptureCallback } = require("process");
const request = require("supertest");

const app = require("../app");

let items = require("../fakeDb")

let item = {name: "gum", price: 1.50}

beforeEach(async () => {
    items.push(item)
});

afterEach(async() => {
    items = []
});


describe("GET /items", async function(){
    test("Get the list of items", async function(){
        const resp = await request(app).get("/items");
        const {items} = resp.body;
        expect(resp.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    });
});


describe("GET /items/:name", async function(){
    test("Get a single item on list", async function(){
        const resp = await request(app).get(`/items/${item.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item).toEqual(item);
    });

    test("Respond with 404 if item cannot be found", async function(){
        const resp = await request(app).get(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});


describe("POST /items", async function(){
    test("Creates a new item", async function(){
        const resp = await request(app).post(`/items`).send({name:"Burger", price: 1.50});
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item).toHaveProperty("name");
        expect(resp.body.item).toHaveProperty("price");
        expect(resp.body.item.name).toEqual("Burger");
        expect(resp.body.item.price).toEqual(1.50);
    });
});


describe("PATCH /items/:name", async function(){
    test("Update a single item", async function(){
        const resp = await request(app).patch(`/items/${item.name}`).send({name: "Sticker"});
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item).toEqual({name: "Sticker"});
    });

    test("Respond with 404 if item cannot be found", async function(){
        const resp = await request(app).patch(`/items/0`);
        expect(resp.statusCode).toBe(404);
    });
});


describe("DELETE /items/:name", async function(){
    test("Delete a single item", async function(){
        const resp = await request(app).delete(`/items/${item.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({message: "Deleted item"});
    });
});