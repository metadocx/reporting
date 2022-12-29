var assert = require('chai').assert
var expect = require('chai').expect;

describe('Metadocx', function () {
  describe('#Application', function () {
    it('global instance should exist', function () {
      expect(Metadocx).toExist('window.Metadocx does not exist');
    });
  });
});
