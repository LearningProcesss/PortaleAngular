const server = require("../server");
const expect = require('expect');
const supertest = require('supertest');

var _id = ""

describe("POST /api/portale/tickets", () => {
    it("Crea un nuovo Ticket", (done) => {

        const ticketFrontEnd = {
            titolo: "L'integrazione PRO.FILE ha smesso di funzionare",
            evento: {
                testo: "Primo evento dove l'utente descrive cosa no va.",
                creatoDa: "Minerva Mattia",
                file: "c:\files\pippo.txt"
            }
        }

        supertest(server).post("/api/tickets").send(ticketFrontEnd).set('Accept', 'application/json').expect(201).end((err, resp) => {
            if (!err) {
                _id = resp.body.id;
            }

            done(err)
        })
    })
})

describe("GET /api/tickets", () => {
    it("Deve resituire un result set di ticket", (done) => {
        supertest(server).get("/api/tickets").expect(200).expect((resp) => {
            expect(resp.body.resultsArray.length).toBeGreaterThan(0)
        }).end(done)
    })
})

describe("DELETE /api/tickets/:id", () => {
    if (!_id) {
        it("Elimina un ticket dato il suo id", (done) => {
            supertest(server).delete("/api/tickets").send({ id: _id }).expect(200).end((err, resp) => {
                if (!err) {
                    //id = resp.id;
                }
                done(err)
            })
        })
    }
})

