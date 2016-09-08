var radialSlider  = function (id) {
    'use strict';

    var slider,
        the_body,
        canvas,
        context,
        x0,
        y0,
        radius,
        w2,
        h2,
        counterClockwise,
        startAngle = 1.5 * Math.PI + 0.000001,
        endAngle,
        customEvt,
        click,
        ang_degrees,
        min,
        max,
        x,y;

    var draw = function() {
        context.clearRect(0, 0, slider.width, slider.height);

        // Scale
        context.beginPath();
        context.strokeStyle = '#EEEEEE';
        context.arc(x0, y0, radius, 1.5 * Math.PI + 0.00001, 1.5 * Math.PI - 0.00001, counterClockwise);
        context.lineWidth = 35;
        context.stroke();

        // Data
        context.beginPath();
        context.strokeStyle = '#104b63';
        context.arc(x0, y0, radius, startAngle, endAngle, counterClockwise);
        context.lineWidth = 35;
        context.stroke();

        // Knob
        context.beginPath();
        context.strokeStyle = '#eb879c';
        context.arc(Math.cos(endAngle)*radius + w2,Math.sin(endAngle)*radius + h2,10,0,Math.PI*2,true);
        context.lineWidth = 15;
        context.fillStyle = 'yellow';
        context.fill();
        context.stroke();

        // Set value field
        document.getElementById('value').innerHTML = Math.round(ang_degrees);
    };

    function _handleMouseDown() {
        the_body.addEventListener('mousemove', _rotation, false);
    }

    function _handleMouseUp() {
        the_body.removeEventListener('mousemove', _rotation, false);
    }

    function _handleClick(event) {
        _rotation();
    }

    function _handleTouch(event) {
        event.preventDefault();
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

        endAngle = Math.atan2(y-h2, x-w2);
        ang_degrees = (endAngle + Math.PI / 2 > 0 ? endAngle + Math.PI / 2 : (2 * Math.PI + endAngle + Math.PI / 2)) * 360 / (2 * Math.PI);
        ang_degrees = ang_degrees * (max - min) / 360 + Math.round(min);
        draw();
    }

    function _init(id, options) {
        the_body = document.body;
        slider = document.getElementById(id);
        context = slider.getContext('2d');
        x0 = slider.width / 2;
        y0 = slider.height / 2;

        w2 = x0;
        h2 = y0;
        radius = w2*0.82;
        counterClockwise = false;
        endAngle = 1.5 * Math.PI + 0.0001;
        click = true;
        min = slider.dataset.min || 0;
        max = slider.dataset.max || 100;
        ang_degrees = min;
        draw();
        _setEventBindings();
    }

    _init(id);
};