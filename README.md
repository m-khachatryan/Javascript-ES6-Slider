# Javascript Slider

### Usage

##### Html Template
```
    <div id="slider" class="slider">
        <div class="slider-list" role="list">
            <div class="slider-list-item active"></div>
            <div class="slider-list-item"></div>
            <div class="slider-list-item"></div>
        </div>
        <div class="slider-control prev" role="button" data-direction="prev"></div>
        <div class="slider-control next" role="button" data-direction="next"></div>
    </div>
```
##### Create Slider Instance
```
const slider = new Slider(el, options)
```
##### Parameters
* `el` - DOM Element or Element Id
* `options` - object. It can have 2 properties:
    * `slide` - Automatically start slide items. true | false
    * `interval` - The amount of time to delay between automatically cycling an item. Default - 5000ms.

##### Methods

* `slider.next()`
* `slider.prev()`
