# MiniRangeSlider

MiniRangeSlider is a small, lightweight slider component for Alipay mini programs that allows users to select a range of values within a specified minimum and maximum range. It features a customizable design and a variety of callback functions that can be used to interact with the slider.

## Installation

You can install MiniRangeSlider via npm:

`npm install mini-range-slider`

## Usage

To use Mini Range Slider, simply import the component and add it to your page:

```xml
<mini-range-slider
  trackWidth="{{400}}"
  handleSize="{{24}}"
  trackSize="{{6}}"
  min="{{0}}"
  max="{{100}}"
  backgroundColor="{{'#EAEAEA'}}"
  activeColor="{{'#3880FF'}}"
  onFromCallback="{{onFromCallback}}"
  onToCallback="{{onToCallback}}"
/>
```

## Properties

| Property        | Type     | Default   | Description                                |
| --------------- | -------- | --------- | ------------------------------------------ |
| trackWidth      | Number   | 0         | The width of the slider track.             |
| handleSize      | Number   | 18        | The size of the slider handles.            |
| trackSize       | Number   | 3         | The size of the slider track.              |
| min             | Number   | 0         | The minimum value of the slider.           |
| max             | Number   | 100       | The maximum value of the slider.           |
| backgroundColor | String   | lightblue | The background color of the slider track.  |
| activeColor     | String   | blue      | The active color of the slider track.      |
| onFromCallback  | Function | null      | The callback function for the from handle. |
| onToCallback    | Function | null      | The callback function for the to handle.   |

## License

MiniRangeSlider is licensed under the GNU General Public License v3.0. See the LICENSE file for more details.

## Credits

MiniRangeSlider was created by Abraham Yonas. You can find me on GitHub.
