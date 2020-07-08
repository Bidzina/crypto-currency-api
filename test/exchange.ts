import server from '../src/server';
const chai = require('chai');
const chaiHttp = require('chai-http');
const dotenv = require('dotenv');
const should = chai.should();
dotenv.config();

chai.use(chaiHttp);

before(done => {
    server.on("ready", () => {
        done();
    })
});

describe('Exchange', () => {
    describe('/GET /', () => {
        it('it should return currency rate for crypto', (done) => {
            const crypto   = 'btc';
            const currency = 'usd';
            chai.request(server)
                .get('/')
                .query({ crypto, currency})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.to.be.json;
                    res.body.should.be.a('object')
                    res.body.should.have.property('crypto').eq(crypto);
                    res.body.should.have.property('currency').eq(currency);
                    res.body.should.have.property('value');
                    res.body.should.have.property('last_update');
                    done();
                });
        });
    });
})