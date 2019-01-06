# =radiaSlider=
[![npm (scoped)](https://img.shields.io/npm/v/@maslick/radiaslider.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm bundle size (minified)](https://img.shields.io/badge/minified-6Kb-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm no dependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm download count](https://img.shields.io/npm/dt/@maslick/radiaslider.svg)](https://npmcharts.com/compare/@maslick/radiaslider?minimal=true)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

a pure JavaScript circular/linear knob-style slider

## Features

```
 * works on desktop, mobile and tablets
 * small size (minified ~6 Kb)
 * no dependencies
 * pure JavaScript (ES5)
```

[![alt tag](img/screenshot1.png?raw=true "radioSlider circular")](https://maslick.github.io/radiaSlider/circular/)
[![alt tag](img/screenshot3.png?raw=true "radioSlider linear horizontal")](https://maslick.github.io/radiaSlider/linear/)


## Demo

[Circular](https://maslick.github.io/radiaSlider/circular/) / [linear](https://maslick.github.io/radiaSlider/linear/)


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
  var slider = new Slider({ canvasId: "myCanvas", continuousMode: true, x0: 150, y0: 150 });
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
  var slider = new Slider({ canvasId: "myCanvas",  continuousMode: true,  vertical: false });
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

![alt tag](img/screenshot4.png?raw=true "radioSlider karandashi")

## License

This project is licenced under the [MIT License](http://opensource.org/licenses/mit-license.html).
