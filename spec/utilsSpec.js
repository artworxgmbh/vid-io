/*global VidIo,$,jasmine,describe,it,beforeEach,afterEach,expect*/

describe('VidIo.Utils', function () {
  'use strict';

  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe('noop', function () {
    it('should verify that noop is defined', function () {
      expect(VidIo.Utils.noop).toBeDefined();
    });

    it('should verify that noop() returns undefined', function () {
      expect(VidIo.Utils.noop()).not.toBeDefined();
    });
  });

  describe('tryParseUrlParameter', function () {
    it('should verify that tryParseUrlParameter is defined', function () {
      expect(VidIo.Utils.tryParseUrlParameter).toBeDefined();
    });

    it('should verify that tryParseUrlParameter returns given parameter', function () {
      var expectedParamValue = '1';
      var paramName = 'param';
      var href = 'http://www.example.com?' + paramName + '=' + expectedParamValue;
      var paramValue = VidIo.Utils.tryParseUrlParameter(href, paramName);
      expect(paramValue).toEqual(expectedParamValue);
    });

    it('should return empty when param does not exist', function () {
      var expectedParamValue = '';
      var paramName = 'non-existing-param';
      var href = 'http://www.example.com';
      var paramValue = VidIo.Utils.tryParseUrlParameter(href, paramName);
      expect(paramValue).toEqual(expectedParamValue);
    });
  });

});
