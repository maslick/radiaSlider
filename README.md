# =radiaSlider=
[![npm (scoped)](https://img.shields.io/npm/v/@maslick/radiaslider.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![Build Status](https://travis-ci.org/maslick/radiaSlider.svg?branch=master)](https://travis-ci.org/maslick/radiaSlider)
[![npm bundle size (minified)](https://img.shields.io/badge/minified-5Kb-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm no dependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm download count](https://img.shields.io/npm/dt/@maslick/radiaslider.svg)](https://npmcharts.com/compare/@maslick/radiaslider?minimal=true)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

a pure JavaScript circular/linear knob-style slider

## Features

```
 * works on desktop, mobile and tablets
 * small size (minified ~5 Kb)
 * no dependencies
 * pure JavaScript (ES6)
 * browser and Node.js friendly
```

[![screenshot](img/radiaslider.png?raw=true "radiaSlider circular")](https://maslick.github.io/radiaSlider/demo/circular.html)


## Demo

[Circular](https://maslick.github.io/radiaSlider/demo/circular.html) / [linear](https://maslick.github.io/radiaSlider/demo/linear.html) / [react.js](https://maslick.github.io/react-radiaslider/demo/)


## Quickstart

- create a canvas and the value field
```html
<canvas id="myCanvas" width="300" height="300"></canvas>
<span id="value1"></span>
```
### Circular slider

- import js
```html
<script src="slider-circular.min.js"></script>
```
 - initialize a slider
```js
<script>
  const slider = new Slider({ canvasId: "myCanvas", continuousMode: true, x0: 150, y0: 150 });
  slider.addSlider({
    id: 1,
    radius: 50,
    min: 0,
    max: 30,
    step: 5,
    color: "#104b63",
    changed: function (v) {
      document.getElementById('value1').innerHTML = "Angle: " + v.deg + " deg, value: " + v.value;
    }
  });
</script>
```

### Linear slider

- import js
```html
<script src="slider-linear.min.js"></script>
```
 - initialize a slider
```js
<script>
  const slider = new Slider({ canvasId: "myCanvas",  continuousMode: true,  vertical: false });
  slider.addSlider({
    id: 1
    width: 50,
    min: 0,
    max: 30,
    step: 5,
    color: "#104b63",
    changed: function (v) {
      document.getElementById('value1').innerHTML = "Width: " + v.width + " px, value: " + v.value;
    },
    x0: 30,
    y0: 30
  });
</script>
```

## Get/set value programmatically

If you want to change the value programmatically, use:
```js
slider.setSliderValue(<sliderId>, <value>);
```

To get the current value:
```js
slider.sliders[<sliderId>].normalizedValue     // current value
slider.sliders[<sliderId>].ang_degrees         // current angle in degrees (circular only)
slider.sliders[<sliderId>].endAngle            // current angle in radians (circular only)
slider.sliders[<sliderId>].value               // current width in pixels  (linear only)
```

![alt tag](img/screenshot1.png?raw=true "radioSlider karandashi")

## Using Node.js
*Radia slider* can be used either in the [Browser](https://github.com/maslick/radiaSlider/tree/master/dist) or in the Node.js environment.

```js
// ES6 syntax
import CircularSlider from "@maslick/radiaslider";
import LinearSlider from "@maslick/radiaslider/src/slider-linear";

// Node.js syntax
const CircularSlider = require("@maslick/radiaslider");
const LinearSlider = require("@maslick/radiaslider/src/slider-linear");

const circular = new CircularSlider({...});
const linear = new LinearSlider({...});
```

For a React.js example check out [this project](https://github.com/maslick/react-radiaslider).
