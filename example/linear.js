import { linear as Slider } from "../index"

var colors = [
    "#104b63",
    "#ff9a9a",
    "#76c7e9",
    "#ffff9a",
    "#9e9e9e",
    "#bcf5bc",
    "#f096f0",
    "#229ed1"
];

var temp = {
    min: -100,
    max: 100,
    step: 10
};

var slider0 = new Slider({ canvasId: "myCanvas0", continuousMode: true,  vertical: false });
var slider1 = new Slider({ canvasId: "myCanvas1", continuousMode: false, vertical: false });
var slider2 = new Slider({ canvasId: "myCanvas2", continuousMode: true,  vertical: true });
var slider3 = new Slider({ canvasId: "myCanvas3", continuousMode: false, vertical: true });
var karandashi = new Slider({ canvasId: "karandashi", continuousMode: true, vertical: true });

initSliders();
initKarandashi();

function randomInRange(start,end){
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function initSliders() {
    for (var i=0; i<=6; i++) {
        //horizontal sliders
        var t = temp;
        t.width = 260;
        t.color = colors[i];
        t.x0 = 30;
        t.y0 = 30 + 40*i;
        t.id = i;
        slider0.addSlider(t);
        slider0.setSliderValue(i, randomInRange(-100,100));

        slider1.addSlider(t);
        slider1.setSliderValue(i, randomInRange(-100,100));

        //vertical sliders
        t.width = 210;
        t.x0 = 40 + 40*i;
        t.y0 = 240;
        slider2.addSlider(t);
        slider2.setSliderValue(i, randomInRange(-100,100));

        slider3.addSlider(t);
        slider3.setSliderValue(i, randomInRange(-100,100));
    }
}

function initKarandashi() {
    for (var i=0; i<24; i++) {
        var t = temp;
        t.width = 340;
        t.color = colors[i%8];
        t.x0 = 30 + 40*i;
        t.y0 = 370;
        t.id = i.toString();
        karandashi.addSlider(t);
        karandashi.setSliderValue(t.id, randomInRange(temp.min, temp.max));
    }
}