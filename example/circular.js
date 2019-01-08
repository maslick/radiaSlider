import { circular as Slider } from "../index"

var slider = new Slider({canvasId: "myCanvas", continuousMode: true});
slider.addSlider({
    id: 1,
    radius: 50,
    min: -50,
    max: 50,
    color: "#104b63",
    step: 1,
    changed: function (v) {
        document.getElementById('value1').innerHTML = "Angle: " + v.deg.toFixed(2) + " deg, value: " + v.value.toFixed(2);
    }
});
slider.setSliderValue(1, 34);

slider.addSlider({
    id: 2,
    radius: 90,
    min: -100,
    max: 100,
    color: "#ff9a9a",
    step: 5,
    changed: function (v) {
        document.getElementById('value2').innerHTML = "Angle: " + v.deg.toFixed(2) + " deg, value: " + v.value.toFixed(2);
    }
});
slider.setSliderValue(2, 70);

slider.addSlider({
    id: 3,
    radius: 130,
    min: 0,
    max: 360,
    color: "#76c7e9",
    step: 0.1,
    changed: function (v) {
        document.getElementById('value3').innerHTML = "Angle: " + v.deg.toFixed(2) + " deg, value: " + v.value.toFixed(2);
    }
});
slider.setSliderValue(3, 307);

var slider2 = new Slider({canvasId: "myCanvas2"});
slider2.addSlider({
    id: 1,
    radius: 90,
    min: 0,
    max: 30,
    step: 3,
    color: "#76c7e9",
    changed: function (v) {
        document.getElementById('value4').innerHTML = "Angle: " + v.deg.toFixed(2) + " deg, value: " + v.value.toFixed(2);
    }
});

slider2.addSlider({
    id: 3,
    radius: 130,
    min: -1,
    max: 1,
    step: 0.2,
    color: "#ff9a9a",
    changed: function (v) {
        document.getElementById('value5').innerHTML = "Angle: " + v.deg.toFixed(2) + " deg, value: " + v.value.toFixed(2);
    }
});