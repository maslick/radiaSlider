# =radiaSlider=
a simple pure JavaScript circular knob-style slider

![alt tag](screenshot.png?raw=true "radioSlider")

```
 * works on desktop, mobile and tablets
 * minified ~5 Kb
```
###quickstart
- import js
```
<script src="slider-min.js"></script>
```
- create a canvas and the value field
```
<canvas id="myCanvas" width="300" height="300"></canvas>
<span id="value1"></span>
```
 - initialize a slider
```
<script>
  var slider = new Slider("myCanvas");
  slider.addSlider({
    id: 1,
    container: "myCanvas",
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

- if you want to change the value programmatically, use:
```
slider.setSliderValue(<sliderId>, <value>);
```


###demo 
http://maslick.neocities.org/slider/

