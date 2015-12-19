'use strict';

var utils = (function () {
  return {
    noop: function () {
    },
    /**
     * _getURLParameter - parsing the URL query string for a specific param
     * @param paramName
     * @returns {string}
     * @private
     */
    tryParseUrlParameter: function (url, paramName) {
      paramName = paramName.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
      var regexS = '[\\?&]' + paramName + '=([^&#]*)';
      var regex = new RegExp(regexS);
      var results = regex.exec(url);
      if (!results || results.length <= 1) {
        return '';
      } else {
        return results[1];
      }
    }
  };
})();

var VideoTracker = function (element, _options) {
  if (!element) {
    throw new Error('Invalid element');
  }
  if (!element.id) {
    element.id = '_vidio_' + (new Date().getTime());
  }
  var options = _options || {};

  /** URL-Base for Tracking Pixel **/
  var baseUrl = options.baseUrl;

  var additionalUrlParams = options.additionalUrlParams || {};

  /** The current loop for information **/
  this.loop = -1;

  var self = this;
  /** mute delays are just to avoid sending multiple mute events at once **/
  var muteDelays = [];

  var _createTargetUrlForEvent = function (eventName) {
    var innerLoop = self.loop > 0 ? self.loop : 0;
    var ts = (new Date().getTime());

    var targetUrl = baseUrl +
      '?event=' + encodeURIComponent(eventName) +
      '&loop=' + innerLoop +
      '&ts=_' + ts;

    for (var paramName in additionalUrlParams) {
      if (additionalUrlParams.hasOwnProperty(paramName)) {
        targetUrl += '&' + paramName + '=' + encodeURIComponent(additionalUrlParams[paramName]);
      }
    }

    return targetUrl;
  };

  /**
   * sendEvent - triggers a tracking pixel with a specific event and loop
   * @param event
   * @param loop
   */
  var sendEvent = function (eventName) {
    var targetUrl = _createTargetUrlForEvent(eventName);
    _createPixel(targetUrl, eventName);
  };

  /**
   * _createPixel - creates an image with the tracking source, appends it to the DOM
   * and removes itself after loaded
   * @param url
   * @private
   */
  function _createPixel(url, event) {
    var id = 'pixel_' + event + '_' + (new Date().getTime());
    var image = new Image();
    image.src = url;
    image.id = id;
    image.height = 1;
    image.width = 1;
    image.style.visibility = 'hidden';
    image.onload = function () {
      console.log('sent');
      try {
        this.parentElement.removeChild(this);
      } catch (e) {
      }
    };
    document.body.appendChild(image);
  }

  /**
   * _trackVideo - starts to initialize the tracking for a video element
   * @param element
   * @private
   */
  function _setupEventListeners(element) {
    console.log('Tracking video', element.id);
    var addListener = function (eventName, callback) {
      element.addEventListener(eventName, callback, true);
    };
    var removeListener = function (eventName, callback) {
      element.removeEventListener(eventName, callback);
    };

    addListener('error', _videoError);
    addListener('loadstart', _videoLoading);
    addListener('loadeddata', _videoLoaded);
    addListener('pause', _videoPaused);
    addListener('playing', _videoResume);
    addListener('volumechange', _videoVolume);
    addListener('seeking', _videoSeeking);
    addListener('seeked', _videoSeeked);
    addListener('timeupdate', _videoProgress);
    addListener('ended', _videoEnded);

    return function _removeListener() {
      removeListener('error', _videoError);
      removeListener('loadstart', _videoLoading);
      removeListener('loadeddata', _videoLoaded);
      removeListener('pause', _videoPaused);
      removeListener('playing', _videoResume);
      removeListener('volumechange', _videoVolume);
      removeListener('seeking', _videoSeeking);
      removeListener('seeked', _videoSeeked);
      removeListener('timeupdate', _videoProgress);
      removeListener('ended', _videoEnded);
    };
  }


  /**
   * _videoError - event for video errors
   * @param event
   * @private
   */
  function _videoError(event) {
    var element = event.target;
    console.log('videoError', element.error, event);
  }

  /**
   * _videoLoading - event for video loading
   * @param event
   * @private
   */
  function _videoLoading(event) {
    console.log('videoLoading', event);
  }

  /**
   * _videoLoaded - event for video loaded
   * @param event
   * @private
   */
  function _videoLoaded(event) {
    console.log('videoLoaded', event);
    sendEvent('creativeview');
  }

  /**
   * _videoPaused - event for video paused
   * @param event
   * @private
   */
  function _videoPaused(event) {
    console.log('videoPaused', event);
    sendEvent('pause');
  }

  /**
   * _videoResume - event for video start and continue
   * @param event
   * @private
   */
  function _videoResume(event) {
    var element = event.target;
    if (element.currentTime < 1) {
      self.loop = self.loop + 1;
      console.log('videoPlay', self.loop, event);
      sendEvent('start');
    } else {
      console.log('videoResume', event);
      sendEvent('resume');
    }
  }

  /**
   * _videoSeeking - event for video seeking
   * @param event
   * @private
   */
  function _videoSeeking(event) {
    var element = event.target;
    if (element.currentTime < 1) {
      console.log('videoEnded', self.loop, event);
      sendEvent('complete');
    } else {
      console.log('videoSeeking', event);
      sendEvent('seek');
    }
  }

  /**
   * _videoSeeked - event for end of video seeking
   * @param event
   * @private
   */
  function _videoSeeked(event) {
    var element = event.target;
    if (element.currentTime > 0) {
      console.log('videoSeeked', event);
    } else {
      console.log('videoRewind', event);
    }
  }

  /**
   * _videoProgress - event for video progress every second
   * @param event
   * @private
   */
  function _videoProgress(event) {
    var element = event.target;
    var percentage = (element.currentTime * 100) / element.duration;

    if (percentage >= 24.5 && percentage <= 26) {
      console.log('first quartile', event);
      sendEvent('firstquartile');
    } else if (percentage >= 49.5 && percentage <= 51) {
      console.log('midpoint', event);
      sendEvent('midpoint');
    } else if (percentage >= 74.5 && percentage <= 76) {
      console.log('third quartile', event);
      sendEvent('thirdquartile');
    }
  }

  /**
   * _videoEnded - event for video ended
   * @param event
   * @private
   */
  function _videoEnded(event) {
    console.log('videoEnded', self.loop, event);
    sendEvent('complete');
  }

  /**
   * _videoVolume - event for video volume change (mute / unmute)
   * @param event
   * @private
   */
  function _videoVolume(event) {
    var element = event.target;
    var delayer = muteDelays[element.id];

    if (delayer) {
      clearTimeout(delayer);
    }

    if (element.muted || element.volume === 0) {
      muteDelays[element.id] = setTimeout(function () {
        console.log('videoMuted', event);
        sendEvent('mute');
      }, 100);
    } else {
      muteDelays[element.id] = setTimeout(function () {
        console.log('videoUnMuted', event);
        sendEvent('unmute');
      }, 100);
    }
  }


  this._removeEventListeners = utils.noop;

  this.start = function () {
    if (!self.started) {
      self._removeEventListeners = _setupEventListeners(element);
    }
    self.started = true;
  };

  this.stop = function () {
    if (self.started) {
      self._removeEventListeners();
      self._removeEventListeners = utils.noop;
    }
    self.started = false;
  };

  if (options.autoStart) {
    this.start();
  }
};

var looksLikeUrl = function (possibleUrl) {
  return /^(http|https):\/\/.*$/.test(possibleUrl);
};
var isObject = function (possibleObject) {
  return possibleObject && typeof possibleObject === 'object';
};

var VidIo = function (options) {
  var _options = options || {};

  if (!looksLikeUrl(_options.baseUrl)) {
    throw new Error('Invalid url');
  }

  _options.autoStart = _options.autoStart !== false;
  _options.additionalUrlParams = isObject(_options.additionalUrlParams) ?
    _options.additionalUrlParams : {};

  return {
    auto: function () {
      var element = document.getElementsByTagName('video')[0] || null;
      return new VideoTracker(element, _options);
    },
    forElement: function (elementId) {
      var element = document.getElementById(elementId) || null;
      return new VideoTracker(element, _options);
    }
  };
};

VidIo.Utils = utils;
