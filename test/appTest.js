const assert = require('chai').assert;
const app = require('../app.js');

describe('App', function(){
    it('must be true', function(){
        assert.isTrue(app.sanityTest());
    });
});