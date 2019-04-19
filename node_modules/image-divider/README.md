# image-divider

[![npm version](https://badge.fury.io/js/image-divider.svg)](http://badge.fury.io/js/image-divider)
[![Build Status](https://travis-ci.org/kjirou/image-divider.svg?branch=master)](https://travis-ci.org/kjirou/image-divider)

Divide a large image to small images


## Preparation
### Install imagemagick
This npm-module depends on [imagemagick](http://www.imagemagick.org/) CLI tools.

e.g. Mac with Homebrew:
```
brew install imagemagick
```

e.g. Debian:
```
sudo apt-get install imagemagick
```

Assert ImageMagick is installed:
```
$convert --version
Version: ImageMagick 6.8.7-7 Q16 x86_64 2013-11-27 http://www.imagemagick.org
Copyright: Copyright (C) 1999-2014 ImageMagick Studio LLC
Features: DPC Modules
Delegates: bzlib freetype jng jpeg ltdl png xml zlib
```


## Installation
```
npm install -g image-divider
```


## Usage
1) Put a configuration file like this

`image-divider.js`:
```
module.exports = {
  images: [{
    src: 'path/to/large.png',
    pos: [16, 32],
    size: [16, 16],
    dest: 'path/to/dest/icon-1.png'
  }, {
    src: 'path/to/large.png',
    pos: [16, 48],
    size: [16, 16],
    dest: 'foo/bar/dest/icon-2.png'
  }]
};
```

2) Execute a command

```bash
image-divider --conf path/to/image-divider.js
```

3) Then, two small images are created

```bash
$tree foo/bar/dest
foo/bar/dest
├── icon-1.png
└── icon-2.png
```

Note:
- `--conf, -c` option
  - Set a path to configuration file
  - Use `./image-divider.js` if it is not set
