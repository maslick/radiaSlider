function Slider(container) {
    var container = document.getElementById(container);
    var the_body = document.body;
    var context = container.getContext('2d');
    var x0 = container.width / 2;
    var y0 = container.height / 2;
    var scaleWidth = 35;
    var fillWidth = 35;
    var knobWidth = 35;
    var startAngle = 1.5 * Math.PI + 0.000001;
    var endAngle = 1.5 * Math.PI - 0.000001;

    this.sliders = {};
    this.scaleWidth = scaleWidth;
    this.fillWidth = fillWidth;
    this.knobWidth = knobWidth;

    this.startAngle = startAngle;
    this.endAngle = endAngle;

    this.container = container;
    this.the_body = the_body;
    this.context = context;
    this.x0 = x0;
    this.y0 = y0;

    this.selectedSlider = null;
    this.currentSlider = null;

    var self = this;
    this.container.addEventListener('mousedown', _handleMouseDown, false);
    self.the_body.addEventListener('mouseup', _handleMouseUp, false);
    this.container.addEventListener('click', _handleClick, false);

    this.container.addEventListener('touchstart', _handleTouch, false);
    this.container.addEventListener('touchmove', _handleMove, false);
    this.container.addEventListener('touchend', _handleEnd, false);

    function getSelectedSlider() {
        var hip = Math.sqrt(Math.pow(event.layerX - self.x0, 2) + Math.pow(event.layerY - self.y0, 2));

        for (var key in self.sliders) {
            if (!self.sliders.hasOwnProperty(key)) continue;
            var obj = self.sliders[key];
            if (Math.abs(hip - obj.radius) <= self.scaleWidth / 2) {
                var selectedSlider = obj;
                break;
            }
        }
        return selectedSlider ? selectedSlider : null;
    }

    function _handleMouseDown(event){
        event.preventDefault();
        self.selectedSlider = getSelectedSlider();
        if (!self.selectedSlider) return;
        self.the_body.addEventListener('mousemove', _rotation, false);
    }

    function _handleMouseUp() {
        self.the_body.removeEventListener('mousemove', _rotation, false);
        self.currentSlider = self.selectedSlider;
    }

    function _handleClick(event) {
        if (self.currentSlider && getSelectedSlider() && self.currentSlider.id != getSelectedSlider().id) {
            return;
        }
        if (self.selectedSlider) {
            _rotation();
        }
    }

    function _handleTouch(event) {
        event.preventDefault();
        self.selectedSlider = getSelectedSlider();
        if (self.selectedSlider) {
            _rotation();
        }
    }

    function _handleMove(event) {
        event.preventDefault();
        _rotation();
    }

    function _handleEnd(event) {
        event.preventDefault();
        self.the_body.removeEventListener('mousemove', _rotation, false);
    }

    function _rotation() {
        x = event.layerX;
        y = event.layerY;
        self.calculateAngles(x, y);
        self.drawAll();
    }
}


Slider.prototype.addSlider = function (options) {
    this.sliders[options.id] = {
        id: options.id,
        container: document.getElementById(options.container),
        color: options.color || '#104b63',
        min: options.min || 0,
        max: options.max || 100,
        radius: options.radius || 100,
        startAngle: this.startAngle,
        endAngle: this.endAngle,
        onValueChangeCallback: options.changed || function(v) {},
        ang_degrees: 0,
        normalizedValue: options.min || 0,
        step: options.step || 1
    };

    var obj = this.sliders[options.id];
    //obj.da = Math.abs(2*Math.PI*obj.step/(obj.max-obj.min));

    this.setSliderValue(obj.id, options.min);
};

Slider.prototype.drawScale = function(slider) {
    var context = slider.container.getContext('2d');
    // Scale
    for (var i = 0; i <= Math.PI * 2; i += Math.PI / 6) {
        context.beginPath();
        context.strokeStyle = '#eeeeee';
        context.arc(this.x0, this.y0, slider.radius, i, i + Math.PI / 6, false);
        context.lineWidth = this.scaleWidth;
        context.stroke();
    }
    // Dot in the center
    context.beginPath();
    context.strokeStyle = '#eeeeee';
    context.arc(this.x0, this.y0, this.scaleWidth/2, 0, Math.PI*2, false);
    context.lineWidth = 1;
    context.fillStyle = '#eeeeee';
    context.fill();
};

Slider.prototype.drawData = function(slider) {
    // Data
    var context = slider.container.getContext('2d');
    context.beginPath();
    context.strokeStyle = slider.color;
    context.arc(this.x0, this.y0, slider.radius, slider.startAngle, slider.endAngle, false);
    context.lineWidth = this.fillWidth;
    context.stroke();
};

Slider.prototype.drawArrow = function(slider) {
    // Arrow
    var context = slider.container.getContext('2d');
    context.beginPath();
    context.moveTo(this.x0, this.y0 - slider.radius + this.scaleWidth / 2);
    context.lineTo(this.x0, this.y0 - this.scaleWidth - slider.radius + this.scaleWidth / 2);
    context.lineTo(this.x0 + this.scaleWidth / 4, this.y0 - this.scaleWidth / 2 - slider.radius + this.scaleWidth / 2);
    context.fillStyle = "#eeeeee";
    context.fill();
};

Slider.prototype.drawKnob = function(slider) {
    // Knob
    var context = slider.container.getContext('2d');
    context.beginPath();
    context.strokeStyle = '#eb879c';
    context.arc(Math.cos(slider.endAngle)*slider.radius + this.x0,
        Math.sin(slider.endAngle)*slider.radius + this.y0,
        this.knobWidth/2,
        0,Math.PI*2,false);
    context.lineWidth = 1;

    context.fillStyle = '#eb879c';
    context.fill();

    // Dot on the knob
    context.beginPath();
    context.strokeStyle = 'yellow';
    context.arc(Math.cos(slider.endAngle)*slider.radius + this.x0,
        Math.sin(slider.endAngle)*slider.radius + this.y0,
        this.scaleWidth/10,
        0,Math.PI*2,false);
    context.lineWidth = 1;
    context.fillStyle = 'yellow';
    context.fill();
};

Slider.prototype.calculateAngles = function (x, y) {
    var max = this.selectedSlider.max,
        min = this.selectedSlider.min,
        step = this.selectedSlider.step,
        endAngle = Math.atan2(y-this.y0, x-this.y0),
        ang_degrees = this.radToDeg(this.normalizeTan(endAngle)),
        normalizedValue = this.normalizeTan(endAngle) * (max - min) / (2 * Math.PI) + min;

    normalizedValue = (normalizedValue / step >> 0) * step;

    this.selectedSlider.endAngle = endAngle;
    this.selectedSlider.ang_degrees = ang_degrees;
    this.selectedSlider.normalizedValue = normalizedValue;
};

Slider.prototype.radToDeg = function (ang) {
    return ang * 180 / Math.PI;
};

Slider.prototype.normalizeTan = function (ang) {
    var rads = ang + Math.PI / 2 > 0 ? ang + Math.PI / 2 : (2 * Math.PI + ang + Math.PI / 2);
    return rads;
};

Slider.prototype.setSliderValue = function (id, value) {
    var slider = this.sliders[id];
    if (value <= slider.min) {
        slider.endAngle = this.startAngle;
        slider.ang_degrees = 0;
        slider.normalizedValue = 0;
    }
    else if (value >= slider.max) {
        slider.endAngle = this.endAngle;
        slider.ang_degrees = 360;
        slider.normalizedValue = slider.max;
    }
    else {
        //value = (value / slider.step >> 0) * slider.step;
        slider.endAngle = 2 * Math.PI * (value - slider.min) / (slider.max - slider.min) - Math.PI/2;
        slider.ang_degrees = this.radToDeg(this.normalizeTan(slider.endAngle));
        slider.normalizedValue = value;
    }

    this.drawAll();
};

Slider.prototype.drawAll = function () {
    this.context.clearRect(0, 0, this.container.width, this.container.height);
    for (var key in this.sliders) {
        if (!this.sliders.hasOwnProperty(key)) continue;
        var obj = this.sliders[key];
        this.drawScale(obj);
        this.drawData(obj);
        this.drawArrow(obj);
        this.drawKnob(obj);
        obj.onValueChangeCallback({'rad': obj.endAngle, 'deg': obj.ang_degrees, 'value': obj.normalizedValue});
    }
};
