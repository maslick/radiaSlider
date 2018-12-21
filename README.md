# =radiaSlider=
[![npm (scoped)](https://img.shields.io/npm/v/@maslick/radiaslider.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm bundle size (minified)](https://img.shields.io/badge/minified-6Kb-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm no dependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

a simple pure JavaScript circular/linear knob-style slider

## Features

```
 * works on desktop, mobile and tablets
 * small size (minified ~6 Kb)
 * no dependencies
 * pure JavaScript (ECMAScript 5.1)
```

[![alt tag](screenshot.png?raw=true "radioSlider circular")](http://maslick.neocities.org/slider-circular/)
[![alt tag](screenshot3.png?raw=true "radioSlider linear horizontal")](http://maslick.neocities.org/slider-linear/)


## Demo

[Circular](http://maslick.neocities.org/slider-circular/) / [linear](http://maslick.neocities.org/slider-linear/)


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
  var slider = new Slider({canvasId: "myCanvas", continuousMode: true, x0: 150, y0: 150});
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
  var slider = new Slider({canvasId: "myCanvas",  continuousMode: true,  vertical: false});
  slider.addSlider({
    id: 1,
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

- if you want to change the value programmatically, use:
```js
slider.setSliderValue(<sliderId>, <value>);
```

## License

This project is licenced under the [MIT License](http://opensource.org/licenses/mit-license.html).
