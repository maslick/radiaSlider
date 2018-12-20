# =radiaSlider=
[![npm (scoped)](https://img.shields.io/npm/v/@maslick/radiaslider.svg)](https://www.npmjs.com/package/@maslick/radiaslider)
[![npm bundle size (minified)](https://img.shields.io/badge/minified-5.5Kb-green.svg)](https://www.npmjs.com/package/@maslick/radiaslider)

a simple pure JavaScript circular/linear knob-style slider


```
 * works on desktop, mobile and tablets
 * minified ~5 Kb
```

![alt tag](screenshot.png?raw=true "radioSlider circular")
![alt tag](screenshot3.png?raw=true "radioSlider linear horizontal")


### quickstart
- create a canvas and the value field
```
<canvas id="myCanvas" width="300" height="300"></canvas>
<span id="value1"></span>
```
#### circular
- import js
```
<script src="slider-circular.min.js"></script>
```
 - initialize a slider
```
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

#### linear
- import js
```
<script src="slider-linear.min.js"></script>
```
 - initialize a slider
```
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
```
slider.setSliderValue(<sliderId>, <value>);
```

### demo

http://maslick.neocities.org/slider-circular/

http://maslick.neocities.org/slider-linear/

