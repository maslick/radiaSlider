var radialSlider  = function (id, options) {
    'use strict';

    var slider,
        the_body,
        canvas,
        context,
        x0,
        y0,
        radius,
        startAngle,
        endAngle,
        ang_degrees,
        normalizedValue,
        min,
        max,
        x,
        y,
        onValueChangeCallback,
        scaleWidth, knobWidth, fillWidth,
        hip;

    var draw = function() {
        context.clearRect(0, 0, slider.width, slider.height);

        // Scale
        for (var i = 0; i<= Math.PI*2; i+=Math.PI/20) {
            context.beginPath();
            context.strokeStyle = '#eeeeee';
            context.arc(x0, y0, radius, i, i+Math.PI/25, false);
            context.lineWidth = scaleWidth;
            context.stroke();
        }

        // Data
        context.beginPath();
        context.strokeStyle = '#104b63';
        context.arc(x0, y0, radius, startAngle, endAngle, false);
        context.lineWidth = fillWidth;
        context.stroke();

        // Arrow
        context.beginPath();
        context.moveTo(x0,y0 - radius + scaleWidth/2);
        context.lineTo(x0,y0-scaleWidth - radius + scaleWidth/2);
        context.lineTo(x0+scaleWidth/2.6,y0-scaleWidth/2 - radius + scaleWidth/2);
        context.fillStyle = "#eeeeee";
        context.fill();

        // Knob
        context.beginPath();
        context.strokeStyle = '#eb879c';
        context.arc(Math.cos(endAngle)*radius + x0,
                    Math.sin(endAngle)*radius + y0,
                    knobWidth/2,
                    0,Math.PI*2,false);
        context.lineWidth = 1;

        context.fillStyle = '#eb879c';
        context.fill();

        // Dot on the knob
        context.beginPath();
        context.strokeStyle = 'yellow';
        context.arc(Math.cos(endAngle)*radius + x0,
                    Math.sin(endAngle)*radius + y0,
                    scaleWidth/10,
                    0,Math.PI*2,false);
        context.lineWidth = 1;
        context.fillStyle = 'yellow';
        context.fill();

        // Dot in the center
        context.beginPath();
        context.strokeStyle = '#EEEEEE';
        context.arc(x0, y0, scaleWidth/2, 0, Math.PI*2, false);
        context.lineWidth = 1;
        context.fillStyle = '#EEEEEE';
        context.fill();

        // Callback
        onValueChangeCallback({'rad': endAngle, 'deg': ang_degrees, 'value': normalizedValue});
    };

    function _handleMouseDown() {
        event.preventDefault();
        hip = Math.sqrt(Math.pow(event.layerX - x0, 2) + Math.pow(event.layerY - y0, 2));

        if (Math.abs(hip-radius)>=scaleWidth/2) {
            return;
        }

        the_body.addEventListener('mousemove', _rotation, false);
    }

    function _handleMouseUp() {
        the_body.removeEventListener('mousemove', _rotation, false);
    }

    function _handleClick(event) {
        hip = Math.sqrt(Math.pow(event.layerX - x0, 2) + Math.pow(event.layerY - y0, 2));
        if (Math.abs(hip-radius)>=scaleWidth/2) {
            return;
        }
        _rotation();
    }

    function _handleTouch(event) {
        event.preventDefault();
        hip = Math.sqrt(Math.pow(event.layerX - x0, 2) + Math.pow(event.layerY - y0, 2));
        if (Math.abs(hip-radius)>=scaleWidth/2) {
            return;
        }
        _rotation();
    }

    function _handleMove(event) {
        event.preventDefault();
        _rotation();
    }

    function _handleEnd(event) {
        event.preventDefault();
        the_body.removeEventListener('mousemove', _rotation, false);
    }

    function _setEventBindings() {
        slider.addEventListener('mousedown', _handleMouseDown, false);
        the_body.addEventListener('mouseup', _handleMouseUp, false);
        slider.addEventListener('click', _handleClick, false);

        slider.addEventListener('touchstart', _handleTouch, false);
        slider.addEventListener('touchmove', _handleMove, false);
        slider.addEventListener('touchend', _handleEnd, false);
    }

    function _rotation() {
        x = event.layerX;
        y = event.layerY;

        endAngle = Math.atan2(y-y0, x-y0);
        ang_degrees = (endAngle + Math.PI / 2 > 0 ? endAngle + Math.PI / 2 : (2 * Math.PI + endAngle + Math.PI / 2)) * 360 / (2 * Math.PI);
        normalizedValue = ang_degrees * (max - min) / 360 + Math.round(min);
        draw();
    }

    function _init(id, options) {
        the_body = document.body;
        slider = document.getElementById(id);
        context = slider.getContext('2d');
        x0 = slider.width / 2;
        y0 = slider.height / 2;


        scaleWidth = options.scaleWidth || 35;
        fillWidth = options.fillWidth || 35;
        knobWidth = options.knobWidth || scaleWidth;

        radius = options.radius || 100*0.82;
        startAngle = 1.5 * Math.PI + 0.000001,
        endAngle = 1.5 * Math.PI + 0.0001;
        min = options.min || 0;
        max = options.max || 100;
        ang_degrees = normalizedValue = min;


        onValueChangeCallback = options.change || function (v) {
            document.getElementById('value').innerHTML = Math.round(v.angleDeg);
        };

        draw();
        _setEventBindings();

    }

    _init(id, options);
};