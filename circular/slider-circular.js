(function () {
    function Slider(options) {
        this.sliders = {};
        this.scaleWidth = 35;
        this.fillWidth = 35;
        this.knobWidth = 35;

        this.startAngle = 1.5 * Math.PI + 0.000001;
        this.endAngle = 1.5 * Math.PI - 0.000001;

        this.continuousMode = options.continuousMode || false;

        this.container = document.getElementById(options.canvasId);
        this.the_body = document.body;
        this.context = this.container.getContext('2d');

        this.x0 = options.x0 === undefined ? this.container.width / 2 : options.x0;
        this.y0 = options.y0 === undefined ? this.container.height / 2 : options.y0;

        this.MouseX = 0;
        this.MouseY = 0;

        this.selectedSlider = null;
        this.currentSlider = null;

        this.rotationEventListener = this._rotation.bind(this);
        this.container.addEventListener('mousedown', this._handleMouseDown.bind(this), false);
        this.the_body.addEventListener('mouseup', this._handleMouseUp.bind(this), false);
        this.container.addEventListener('click', this._handleClick.bind(this), false);


        this.container.addEventListener('touchstart', this._handleTouch.bind(this), false);
        this.container.addEventListener('touchmove', this._handleMove.bind(this), false);
        this.container.addEventListener('touchend', this._handleEnd.bind(this), false);

    }


    // Adds a slider band to the slider
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

    // Sets (draws) slider band value given the band id and value
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

    // Redraws everything
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
        this.drawCenterDot();
    };

    // Draw the scale for a selected slider band
    Slider.prototype.drawScale = function(slider) {
        // Scale
        for (var i = 0; i <= Math.PI * 2; i += Math.PI / 6) {
            this.context.beginPath();
            this.context.strokeStyle = '#eeeeee';
            this.context.arc(this.x0, this.y0, slider.radius, i, i + Math.PI / 6, false);
            this.context.lineWidth = this.scaleWidth;
            this.context.stroke();
        }

    };

    // Draw dot in the center
    Slider.prototype.drawCenterDot = function () {
        this.context.beginPath();
        this.context.strokeStyle = '#eeeeee';
        this.context.arc(this.x0, this.y0, this.scaleWidth/2, 0, Math.PI*2, false);
        this.context.lineWidth = 1;
        this.context.fillStyle = '#eeeeee';
        this.context.fill();
    };

    // Draw the data on the selected slider band
    Slider.prototype.drawData = function(slider) {
        this.context.beginPath();
        this.context.strokeStyle = slider.color;
        this.context.arc(this.x0, this.y0, slider.radius, slider.startAngle, slider.endAngle, false);
        this.context.lineWidth = this.fillWidth;
        this.context.stroke();
    };

    // Draw tail arrow
    Slider.prototype.drawArrow = function(slider) {
        this.context.beginPath();
        this.context.moveTo(this.x0, this.y0 - slider.radius + this.scaleWidth / 2);
        this.context.lineTo(this.x0, this.y0 - this.scaleWidth - slider.radius + this.scaleWidth / 2);
        this.context.lineTo(this.x0 + this.scaleWidth / 4, this.y0 - this.scaleWidth / 2 - slider.radius + this.scaleWidth / 2);
        this.context.fillStyle = "#eeeeee";
        this.context.fill();
    };

    // Draw the knob (control element)
    Slider.prototype.drawKnob = function(slider) {
        // Knob
        this.context.beginPath();
        this.context.strokeStyle = '#eb879c';
        this.context.arc(Math.cos(slider.endAngle)*slider.radius + this.x0,
            Math.sin(slider.endAngle)*slider.radius + this.y0,
            this.knobWidth/2,
            0,Math.PI*2,false);
        this.context.lineWidth = 1;

        this.context.fillStyle = '#eb879c';
        this.context.fill();

        // Dot on the knob
        this.context.beginPath();
        this.context.strokeStyle = 'yellow';
        this.context.arc(Math.cos(slider.endAngle)*slider.radius + this.x0,
            Math.sin(slider.endAngle)*slider.radius + this.y0,
            this.scaleWidth/10,
            0,Math.PI*2,false);
        this.context.lineWidth = 1;
        this.context.fillStyle = 'yellow';
        this.context.fill();
    };

    // Calculate angles given the cursor position
    Slider.prototype.calculateAngles = function (x, y) {
        if (!this.selectedSlider) { return; }

        var max = this.selectedSlider.max,
            min = this.selectedSlider.min,
            step = this.selectedSlider.step,
            endAngle = Math.atan2(y-this.y0, x-this.x0),
            ang_degrees = this.radToDeg(this.normalizeTan(endAngle)),
            normalizedValue = this.normalizeTan(endAngle) * (max - min) / (2 * Math.PI) + min;

        normalizedValue = (normalizedValue / step >> 0) * step;

        this.selectedSlider.endAngle = endAngle;
        this.selectedSlider.ang_degrees = ang_degrees;
        this.selectedSlider.normalizedValue = normalizedValue;
    };

    // Helper method
    Slider.prototype.radToDeg = function (ang) {
        return ang * 180 / Math.PI;
    };

    // Normalizes tangent
    Slider.prototype.normalizeTan = function (ang) {
        var rads = ang + Math.PI / 2 > 0 ? ang + Math.PI / 2 : (2 * Math.PI + ang + Math.PI / 2);
        return rads;
    };

    // Calculates cursor coordinates
    Slider.prototype.calculateUserCursor = function () {
        var rect = this.container.getBoundingClientRect();

        if (event.touches) {
            this.MouseX = event.touches[0].clientX - rect.left;
            this.MouseY = event.touches[0].clientY - rect.top;
        }
        else {
            this.MouseX = event.clientX - rect.left;
            this.MouseY = event.clientY - rect.top;
        }
    };


    // Returns a slider band based on the cursor position
    Slider.prototype.getSelectedSlider = function () {
        this.calculateUserCursor();
        var hip = Math.sqrt(Math.pow(this.MouseX - this.x0, 2) + Math.pow(this.MouseY - this.y0, 2));

        for (var key in this.sliders) {
            if (!this.sliders.hasOwnProperty(key)) continue;
            var obj = this.sliders[key];
            if (Math.abs(hip - obj.radius) <= this.scaleWidth / 2) {
                var selectedSlider = obj;
                break;
            }
        }
        return selectedSlider ? selectedSlider : null;
    };


    // Event handlers (mousedown, mouseup, mousemove, mouseclick, touches)
    Slider.prototype._handleMouseDown = function (event) {
        event.preventDefault();
        this.selectedSlider = this.getSelectedSlider();

        if (!this.selectedSlider) return;

        this.the_body.addEventListener('mousemove', this.rotationEventListener, false);
    };

    Slider.prototype._handleMouseUp = function (event) {
        event.preventDefault();
        this.the_body.removeEventListener('mousemove', this.rotationEventListener, false);

        this.currentSlider = this.selectedSlider;
    };

    Slider.prototype._handleClick = function (event) {
        this.selectedSlider = this.getSelectedSlider();

        if (this.currentSlider && this.getSelectedSlider() && this.currentSlider.id !== this.getSelectedSlider().id) {
            return;
        }
        if (this.selectedSlider) {
            this._rotation();
        }
    };

    Slider.prototype._handleTouch = function (event) {
        event.preventDefault();
        this.selectedSlider = this.getSelectedSlider();
        if (this.selectedSlider) {
            this._rotation();
        }
    };

    Slider.prototype._handleMove = function (event) {
        event.preventDefault();
        if (this.continuousMode) {
            this._rotation();
        }
        else {
            if (this.selectedSlider) {
                this._rotation();
            }
        }
    };

    Slider.prototype._handleEnd = function (event) {
        event.preventDefault();
        this.the_body.removeEventListener('mousemove', this.rotationEventListener, false);
    };

    // Rotation wrapper
    Slider.prototype._rotation = function () {
        this.calculateUserCursor();
        if (this.continuousMode) {
            this.selectedSlider = this.getSelectedSlider();
        }

        this.calculateAngles(this.MouseX, this.MouseY);
        this.drawAll();
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = 1;
    else window.Slider = Slider;
})();


