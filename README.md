[![Build Status](https://secure.travis-ci.org/artworxgmbh/vid-io.png?branch=master)](http://travis-ci.org/artworxgmbh/vid-io)
[![Dependency Status](https://david-dm.org/artworxgmbh/vid-io.svg)](https://david-dm.org/artworxgmbh/vid-io)
[![devDependency Status](https://david-dm.org/artworxgmbh/vid-io/dev-status.svg)](https://david-dm.org/artworxgmbh/vid-io#info=devDependencies)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)

![logo](https://raw.githubusercontent.com/artworxgmbh/vid-io/master/vidio-logo.png)

vid-io
==================================================
Video Input-Output

## Usage
```javascript
var myVidIo = VidIo({
  baseUrl: 'https://example.com/video',
  additionalUrlParams: {
    myParam1: 'hello',
    myParam2: VidIo.Utils.tryParseUrlParameter(window.location.href, 'myParam2')
  }
}).forElement('myVideo');
```

## Installation
```
$ bower install artworxgmbh/vid-io --save
```

## Contribute

- Issue Tracker: https://github.com/artworxgmbh/vid-io/issues
- Source Code: https://github.com/artworxgmbh/vid-io

### Prerequisites
```
$ npm install grunt-cli karma-cli bower
```

### Clone Repository
```
$ git clone https://github.com/artworxgmbh/vid-io.git
```

#### Install dependencies
```
$ npm install && bower install
```

#### Build project
```
$ grunt build
```

#### Run tests
```
$ grunt test
```


License
--------------------------------------
The project is licensed under the [MIT License](LICENSE).
