(function () {
    class Slider {
        constructor(options) {
            this.sliders = {};
            this.scaleWidth = 34;
            this.fillWidth = 35;
            this.knobWidth = 35;

            this.continuousMode = options.continuousMode || false;
            this.vertical = options.vertical || false;

            this.container = document.getElementById(options.canvasId);
            this.the_body = document.body;
            this.context = Slider.setupHiDpiCanvas(this.container);

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

        static setupHiDpiCanvas(canvas) {
            let ctx = canvas.getContext('2d');
            let devicePixelRatio = window.devicePixelRatio || 1;
            let backingStoreRatio =
                ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

            let ratio = devicePixelRatio / backingStoreRatio;
            // upscale the canvas if the two ratios don't match
            if (devicePixelRatio !== backingStoreRatio) {
                let oldWidth = canvas.width;
                let oldHeight = canvas.height;

                canvas.width = oldWidth * ratio;
                canvas.height = oldHeight * ratio;

                canvas.style.width = oldWidth + 'px';
                canvas.style.height = oldHeight + 'px';

                // now scale the context to counter
                // the fact that we've manually scaled
                // our canvas element
                ctx.scale(ratio, ratio);
            }
            return ctx;
        }

        // Adds a slider band to the slider
        addSlider(options) {
            this.sliders[options.id] = {
                id: options.id,
                container: document.getElementById(options.container),
                color: options.color || '#104b63',
                width: options.width || 100,
                min: options.min || 0,
                max: options.max || 100,
                step: options.step || 1,
                x0: options.x0 || 0,
                y0: options.y0 || 0,
                onValueChangeCallback: options.changed || function (v) {},
                value: 0,
                normalizedValue: options.min || 0
            };

            const obj = this.sliders[options.id];
            this.setSliderValue(obj.id, options.min);
        }

        // Sets (draws) slider band value given the band id and value
        setSliderValue(id, value) {
            const slider = this.sliders[id];
            if (value <= slider.min) {
                slider.value = 0;
                slider.normalizedValue = slider.min;
            } else if (value >= slider.max) {
                slider.value = slider.width;
                slider.normalizedValue = slider.max;
            } else {
                slider.value = slider.width * (value - slider.min) / (slider.max - slider.min);
                slider.normalizedValue = value;
            }
            this.drawAll();
        }

        // Redraws everything
        drawAll() {
            this.context.clearRect(0, 0, this.container.width, this.container.height);
            for (let key in this.sliders) {
                if (!this.sliders.hasOwnProperty(key)) continue;
                const obj = this.sliders[key];
                this.drawScale(obj);
                this.drawData(obj);
                this.drawKnob(obj);
                obj.onValueChangeCallback({'width': obj.value, 'value': obj.normalizedValue});
            }
        }

        // Draw the scale for a selected slider band
        drawScale(slider) {
            let fix_x = this.vertical ? 0 : 1;
            let fix_y = this.vertical ? 1 : 0;

            // first rounded edge
            this.context.beginPath();
            this.context.strokeStyle = slider.color;
            this.context.arc(slider.x0 + fix_x, slider.y0 - fix_y, this.scaleWidth/2, 0, Math.PI*2, false);
            this.context.lineWidth = 1;
            this.context.fillStyle = slider.color;
            this.context.fill();

            let x1, y1;
            if (this.vertical) {
                x1 = slider.x0;
                y1 = slider.y0 - slider.width;
            }
            else {
                x1 = slider.x0 + slider.width;
                y1 = slider.y0;
            }
            // Scale
            this.context.beginPath();
            this.context.strokeStyle = '#eeeeee';
            this.context.moveTo(slider.x0, slider.y0);
            this.context.lineTo(x1, y1);
            this.context.lineWidth = this.scaleWidth;
            this.context.stroke();


            // second rounded edge
            this.context.strokeStyle = '#eeeeee';
            this.context.arc(x1, y1, this.scaleWidth/2, 0, Math.PI*2, false);
            this.context.lineWidth = 1;
            this.context.fillStyle = '#eeeeee';
            this.context.fill();
        }

        // Draw the data on the selected slider band
        drawData(slider) {
            let x1, y1;
            if (this.vertical) {
                x1 = slider.x0;
                y1 = slider.y0 - slider.value;
            }
            else {
                x1 = slider.x0 + slider.value;
                y1 = slider.y0;
            }

            this.context.beginPath();
            this.context.strokeStyle = slider.color;
            this.context.moveTo(slider.x0, slider.y0);
            this.context.lineTo(x1, y1);
            this.context.lineWidth = this.fillWidth;
            this.context.stroke();
        }

        // Draw the knob (control element)
        drawKnob(slider) {
            // Knob
            let x1, y1;
            if (this.vertical) {
                x1 = slider.x0;
                y1 = slider.y0 - slider.value;
            }
            else {
                x1 = slider.x0 + slider.value;
                y1 = slider.y0;
            }

            this.context.beginPath();
            this.context.strokeStyle = '#eb879c';
            this.context.arc(
                x1,
                y1,
                this.knobWidth / 2,
                0, Math.PI * 2, false
            );
            this.context.lineWidth = 1;

            this.context.fillStyle = '#eb879c';
            this.context.fill();

            // Dot on the knob
            this.context.beginPath();
            this.context.strokeStyle = 'yellow';
            this.context.arc(
                x1,
                y1,
                this.scaleWidth / 10,
                0, Math.PI * 2, false
            );
            this.context.lineWidth = 1;
            this.context.fillStyle = 'yellow';
            this.context.fill();
        }

        // Calculate angles given the cursor position
        calculateValues(x, y) {
            if (!this.selectedSlider) return;

            let max = this.selectedSlider.max,
                min = this.selectedSlider.min,
                step = this.selectedSlider.step,
                w = this.selectedSlider.width;

            let x1;
            x1 = this.vertical ? this.selectedSlider.y0 - y : x - this.selectedSlider.x0;


            let val = x1;
            if (val > this.selectedSlider.width - this.selectedSlider.step) val = this.selectedSlider.width;
            if (val < 0 + this.selectedSlider.step) val = 0;

            let nomval = (val * (max - min)) / (w) + min;
            nomval = (nomval / step >> 0) * step;
            this.selectedSlider.value = val;
            this.selectedSlider.normalizedValue = nomval;
        }

        // Calculates cursor coordinates
        calculateUserCursor() {
            let rect = this.container.getBoundingClientRect();

            if (event.touches) {
                this.MouseX = event.touches[0].clientX - rect.left;
                this.MouseY = event.touches[0].clientY - rect.top;
            } else {
                this.MouseX = event.clientX - rect.left;
                this.MouseY = event.clientY - rect.top;
            }
        }


        // Returns a slider band based on the cursor position
        getSelectedSlider() {
            this.calculateUserCursor();
            let selectedSlider;

            for (let key in this.sliders) {
                if (!this.sliders.hasOwnProperty(key)) continue;
                let obj = this.sliders[key];
                let xx;
                let yy;
                if (this.vertical) {
                    xx = this.MouseX >= obj.x0 - this.scaleWidth / 2 && this.MouseX <= obj.x0 + this.scaleWidth / 2;
                    yy = this.MouseY >= obj.y0 - obj.width - this.scaleWidth / 2 && this.MouseY <= obj.y0 + this.scaleWidth / 2;
                } else {
                    xx = this.MouseX >= obj.x0 - this.scaleWidth / 2 && this.MouseX <= obj.x0 + obj.width + this.scaleWidth / 2;
                    yy = this.MouseY >= obj.y0 - this.scaleWidth / 2 && this.MouseY <= obj.y0 + this.scaleWidth / 2;
                }

                if (xx && yy) {
                    selectedSlider = obj;
                    break;
                }
            }

            return selectedSlider ? selectedSlider : null;
        }


        // Event handlers (mousedown, mouseup, mousemove, mouseclick, touches)
        _handleMouseDown(event) {
            event.preventDefault();
            this.selectedSlider = this.getSelectedSlider();
            if (!this.selectedSlider) return;
            this.the_body.addEventListener('mousemove', this.rotationEventListener, false);
        }

        _handleMouseUp(event) {
            event.preventDefault();
            this.the_body.removeEventListener('mousemove', this.rotationEventListener, false);
            this.currentSlider = this.selectedSlider;
        }

        _handleClick(event) {
            this.selectedSlider = this.getSelectedSlider();
            if (this.currentSlider && this.getSelectedSlider() && this.currentSlider.id !== this.getSelectedSlider().id) return;
            if (this.selectedSlider) this._rotation();
        }

        _handleTouch(event) {
            event.preventDefault();
            this.selectedSlider = this.getSelectedSlider();
            if (this.selectedSlider) this._rotation();
        }

        _handleMove(event) {
            event.preventDefault();
            if (this.continuousMode) this._rotation();
            else if (this.selectedSlider) this._rotation();
        }

        _handleEnd(event) {
            event.preventDefault();
            this.the_body.removeEventListener('mousemove', this.rotationEventListener, false);
        }

        // Rotation wrapper
        _rotation() {
            this.calculateUserCursor();
            if (this.continuousMode) this.selectedSlider = this.getSelectedSlider();
            this.calculateValues(this.MouseX, this.MouseY);
            this.drawAll();
        }
    }


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Slider;
    else window.Slider = Slider;
})();
