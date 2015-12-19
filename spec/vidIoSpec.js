/*global VidIo,$,jasmine,describe,it,expect*/

describe('VidIo', function () {
  'use strict';
  var defaultOptions = {
    baseUrl: 'https://example.com/video'
  };

  it('should throw error when not initialized with valid base url', function () {
    expect(function () {
      return VidIo();
    }).toThrow(new Error('Invalid url'));

    expect(function () {
      return VidIo({
        baseUrl: 'invalid-url'
      });
    }).toThrow(new Error('Invalid url'));
  });

  it('should be able to create VidIo factory objects', function () {
    jasmine.getFixtures().set('<video id="element"></video>');
    var vidIo = VidIo(defaultOptions);

    expect(vidIo).toBeDefined();
    expect(vidIo.auto).toBeDefined();
    expect(vidIo.forElement).toBeDefined();
  });

  it('should throw error when not initialized with element node', function () {
    expect(function () {
      return VidIo(defaultOptions).forElement('non-existing-element');
    }).toThrow(new Error('Invalid element'));
  });

  it('should be able to create VidIo object for existing element', function () {
    jasmine.getFixtures().set('<video id="element"></video>');
    var vidIo = VidIo(defaultOptions).forElement('element');

    expect(vidIo).toBeDefined();
    expect(vidIo.start).toBeDefined();
    expect(vidIo.stop).toBeDefined();
  });
});
