const request = require("supertest")
const mongoose =require("mongoose")
const app = require('../index')

describe('Sample tests totot tata', function() {
    it('Should be an exemple true', function() {
        expect(true).toBe(true)
    })

    it('Should be an exemple false', function() {
        expect(false).toBe(false)
    })
})

describe("Heroes endpoints", () => {

    it("Should get all heroes", function(done) {
        request(app)
            .get("/heroes")
            .expect(200)
            .then(response => {
                console.log()
                expect(Array.isArray(response.body)).toBe(true)
                done()
                // expect(response.body.length).toEqual(1)
            })
            .catch(err  => {
                done(err)
            })
    })

})