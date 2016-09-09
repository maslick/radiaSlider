# =radiaSlider=
a simple pure JavaScript circular knob-style slider

```
 * works on mobile and tablets
 * minified ~4 Kb
```
###usage
```
<script src="slider-min.js"></script>

...

<canvas id="myCanvas" width="300" height="300"></canvas>
<span id="value1"></span>

...

<script>
  var slider = new Slider("myCanvas");
  slider.addSlider({
    id: 1,
    container: "myCanvas",
    radius: 50,
    min: 0,
    max: 30,
    color: "#104b63",
    changed: function (v) {
      document.getElementById('value1').innerHTML = "Angle: " +v.deg + " deg, value: " + v.value;
    }
  });
</script>


```

![alt tag](screenshot.png?raw=true "radioSlider")

###demo 
http://maslick.neocities.org/slider/

