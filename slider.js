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
    var endAngle = 1.5 * Math.PI + 0.0001;

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
        if (self.selectedSlider) {
            self.the_body.addEventListener('mousemove', _rotation, false);
        }
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
        if (!self.selectedSlider) return;
        x = event.layerX;
        y = event.layerY;

        self.selectedSlider.endAngle = Math.atan2(y-self.y0, x-self.y0);
        self.selectedSlider.ang_degrees = (self.selectedSlider.endAngle + Math.PI / 2 > 0 ? self.selectedSlider.endAngle + Math.PI / 2 : (2 * Math.PI + self.selectedSlider.endAngle + Math.PI / 2)) * 360 / (2 * Math.PI);
        self.selectedSlider.normalizedValue = self.selectedSlider.ang_degrees * (self.selectedSlider.max - self.selectedSlider.min) / 360 + Math.round(self.selectedSlider.min);

        draw();
    }

    function draw() {
        self.context.clearRect(0, 0, self.container.width, self.container.height);

        for (var key in self.sliders) {
            if (!self.sliders.hasOwnProperty(key)) continue;
            var obj = self.sliders[key];
            self.drawScale(obj);
            self.drawData(obj);
            self.drawArrow(obj);
            self.drawKnob(obj);
            obj.onValueChangeCallback({'rad': obj.endAngle, 'deg': obj.ang_degrees, 'value': obj.normalizedValue});
        }
    }


};


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
        normalizedValue: options.min || 0
    };

    var obj = this.sliders[options.id];

    this.drawScale(this.sliders[options.id]);
    obj.endAngle = 1.5*Math.PI + 0.000001;
    this.drawData(this.sliders[options.id]);
    this.drawArrow(this.sliders[options.id]);
    this.drawKnob(this.sliders[options.id]);



    obj.onValueChangeCallback({'rad': obj.endAngle, 'deg': obj.ang_degrees, 'value': obj.normalizedValue});
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