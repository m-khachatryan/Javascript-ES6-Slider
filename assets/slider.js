class Slider {

    static get DEFAULT() {
        return {
            interval: 5000,
            slide: false,
        }
    }

    static get DIRECTION() {
        return {
            PREV: 'prev',
            NEXT: 'next',
            LEFT: 'left',
            RIGHT: 'right'
        }
    }

    constructor(element, options) {

        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        this.element = element;
        this.options = Object.assign({}, Slider.DEFAULT, options);

        this.listElement = this.element.querySelector('.slider-list');
        this.items = this.listElement.children;
        this.controls = this.element.querySelectorAll('.slider-control');
        this.indicatorElement = this._createIndicator();
        this.indicators = this.indicatorElement.children;

        this._isSliding = false;
        this._interval = null;

        this._init();
    }

    static _getElementIndex(el) {
        return Array.from(el.parentNode.children).indexOf(el);
    }

    _init() {
        this._start();
        this._bindEvents();

        this.element.style.display = 'block';
    }

    _bindEvents() {
        this.element.addEventListener('click', this._elementClickHandler.bind(this));
        this.indicatorElement.addEventListener('click', this._indicatorClickHandler.bind(this));
        document.addEventListener('visibilitychange', this._visibilityChangeHandler.bind(this));
    }

    _elementClickHandler(e) {
        switch (true) {
            case e.target.classList.contains('slider-control'):
                this._controlClickHandler(e);
                break;
        }
    }

    _controlClickHandler(e) {
        this._stop();
        this._slide(e.target.dataset.direction);
    }

    _indicatorClickHandler(e) {

        if (e.target.tagName !== 'SPAN') return;

        const currentElementIndex = Slider._getElementIndex(this._getCurrentElement());
        const indicatorIndex = Slider._getElementIndex(e.target);

        let direction = currentElementIndex < indicatorIndex ? Slider.DIRECTION.NEXT : Slider.DIRECTION.PREV;

        this._stop();
        this._slide(direction, this.items.item(indicatorIndex));
    }

    _visibilityChangeHandler() {
        document.visibilityState === 'hidden' ?
            this._stop() :
            this._start();
    }

    _setIndicator(index) {
        this.indicatorElement.querySelector('.active').classList.remove('active');

        this.indicators.item(index).classList.add('active');
    }

    _start() {

        if (!this.options.slide || this._interval) return;

        this._interval = setInterval(() => {
            this._slide(Slider.DIRECTION.NEXT);
        }, this.options.interval);
    }

    _stop() {
        if (!this.options.slide) return;

        clearInterval(this._interval);
        this._interval = null;
    }

    _slide(direction, el = null) {

        if (this._isSliding) return;

        let currentElement = this._getCurrentElement(),
            dir = null,
            slideTo = null;

        this._isSliding = true;

        switch (direction) {
            case Slider.DIRECTION.NEXT:
                this.nextElement = el || currentElement.nextElementSibling || this.items.item(0);
                dir = `slider-item-${Slider.DIRECTION.NEXT}`;
                slideTo = `slide-${Slider.DIRECTION.LEFT}`;
                break;
            case Slider.DIRECTION.PREV:
                this.nextElement = el || currentElement.previousElementSibling || this.items.item(this.items.length - 1);
                dir = `slider-item-${Slider.DIRECTION.PREV}`;
                slideTo = `slide-${Slider.DIRECTION.RIGHT}`;
                break;
        }

        this._setIndicator(Slider._getElementIndex(this.nextElement));

        currentElement.addEventListener('transitionend', function transitionHandler(e) {
            const el = e.target;

            el.removeEventListener(e.type, transitionHandler);

            el.classList.remove(dir);
            el.classList.remove(slideTo);
            el.classList.remove('active');

            this.nextElement.classList.remove(dir);
            this.nextElement.classList.remove(slideTo);
            this.nextElement.classList.add('active');

            this._isSliding = false;

            this._start();

        }.bind(this))

        this.nextElement.classList.add(dir);

        setTimeout(() => {
            currentElement.classList.add(slideTo);
            this.nextElement.classList.add(slideTo);
        }, 0)
    }

    _getCurrentElement() {
        return this.listElement.querySelector('.active');
    }

    _createIndicator() {
        let indicators = Array.from(this.items).reduce(function (indicators, item, index) {
            return indicators += `<span data-id="${index}" class="${(!index && 'active') || ''}"></span>`
        }, '');

        this.element.insertAdjacentHTML('afterbegin', `<div class="slider-indicators">${indicators}</div>`);

        return this.element.querySelector('.slider-indicators');
    }

    /** Public Methods */

    next() {
        this._slide(Slider.DIRECTION.NEXT)
    }

    prev() {
        this._slide(Slider.DIRECTION.PREV)
    }
}
