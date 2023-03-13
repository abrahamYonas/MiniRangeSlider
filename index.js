Component({
  data: {
    trackWidth: 300,
    rangeWidth: 0,
    leftRangeMargin: 0,
    rightRangeMargin: 0,
    slider: "left",
    clientX: 0,
    screenRatio: 0,
    min: 0,
    max: 100,
    range: 0,
    handleSize: 18,
    backgroundColor: "lightblue",
    activeColor: "blue",
    trackSize: 3,
  },
  props: {
    trackWidth: null,
    handleSize: null,
    trackSize: 3,
    min: null,
    max: null,
    backgroundColor: null,
    activeColor: null,
    onFromCallback: null,
    onToCallback: null,
  },

  didMount() {
    this.getScreenRatio();
    this.setInitialValues();
  },
  methods: {
    getScreenRatio() {
      const { screenWidth } = my.getSystemInfoSync();
      this.screenRatio = screenWidth / 750;
    },

    setInitialValues() {
      const {
        trackWidth,
        handleSize,
        min,
        max,
        backgroundColor,
        trackSize,
        activeColor,
      } = this.props;

      this.setData({
        trackWidth: this.screenRatio * (trackWidth || 750),
        rangeWidth: this.screenRatio * (trackWidth || 750),
        handleSize: handleSize || this.data.handleSize,
        min: min || this.data.min,
        max: max || this.data.max,
        backgroundColor: backgroundColor || this.data.backgroundColor,
        trackSize: trackSize || this.data.trackSize,
        activeColor: activeColor || this.data.activeColor,
      });
    },

    onTouchStart(e) {
      const { clientX } = e.touches[0];
      const slider = e.target.dataset.slider;
      this.setData({ clientX, slider });
    },
    onTouchMove(e) {
      const { clientX } = e.touches[0];
      const diffX = clientX - this.data.clientX;

      if (this.data.slider === "left") {
        if (diffX > 0) {
          this.moveButton("left", "right", diffX);
        } else {
          this.moveButton("left", "left", -diffX);
        }
      } else if (this.data.slider === "right") {
        if (diffX > 0) {
          this.moveButton("right", "right", diffX);
        } else {
          this.moveButton("right", "left", -diffX);
        }
      }
      this.setData({ clientX });
      this.handleRangeCallback(this.data.slider);
    },
    onTouchEnd(e) {
      const { clientX, slider } = this.data;
      const touchStartClientX = clientX;
      const touchEndClientX = e.changedTouches[0].clientX;
      if (slider === "left") {
        if (touchEndClientX > touchStartClientX) {
          this.moveButton("left", "right", touchEndClientX - touchStartClientX);
        }
        if (touchEndClientX < touchStartClientX) {
          this.moveButton("left", "left", touchStartClientX - touchEndClientX);
        }
        return this.handleRangeCallback("min");
      }
      if (slider === "right") {
        if (touchEndClientX > touchStartClientX) {
          this.moveButton(
            "right",
            "right",
            touchEndClientX - touchStartClientX
          );
        }
        if (touchEndClientX < touchStartClientX) {
          this.moveButton("right", "left", touchStartClientX - touchEndClientX);
        }
        return this.handleRangeCallback("max");
      }
    },
    getTotalRangeWidth(rangeWidth, leftRangeMargin, rightRangeMargin) {
      return rangeWidth + leftRangeMargin + rightRangeMargin;
    },
    calculateRange(operation, pixels) {
      switch (operation) {
        case "totalRangeWidth":
          return (
            this.data.rangeWidth +
            this.data.leftRangeMargin +
            this.data.rightRangeMargin
          );
        case "plusRangeWidth":
          return this.data.rangeWidth + pixels;
        case "minusRangeWidth":
          return this.data.rangeWidth - pixels;
        case "plusLeftRangeMargin":
          return this.data.leftRangeMargin + pixels;
        case "minusLeftRangeMargin":
          return Math.abs(this.data.leftRangeMargin - pixels);
        case "plusRightRangeMargin":
          return this.data.rightRangeMargin + pixels;
        case "minusRightRangeMargin":
          return Math.abs(this.data.rightRangeMargin - pixels);
        default:
          throw new Error("Invalid param");
      }
    },
    updateRangeValues(newRangeWidth, newLeftRangeMargin, newRightRangeMargin) {
      const { trackWidth, slider } = this.data;
      const totalRangeWidth = this.getTotalRangeWidth(
        newRangeWidth,
        newLeftRangeMargin,
        newRightRangeMargin
      );

      if (totalRangeWidth === trackWidth) {
        if (slider === "left") {
          this.setData({
            rangeWidth: newRangeWidth,
            leftRangeMargin: newLeftRangeMargin,
          });
        } else if (slider === "right") {
          this.setData({
            rangeWidth: newRangeWidth,
            rightRangeMargin: newRightRangeMargin,
          });
        } else {
          console.error("Slider value is invalid.");
        }
      } else if (totalRangeWidth > trackWidth) {
        if (slider === "left") {
          this.setData({
            leftRangeMargin: 0,
            rangeWidth: trackWidth - newRightRangeMargin,
          });
        } else if (slider === "right") {
          this.setData({
            rightRangeMargin: 0,
            rangeWidth: trackWidth - newLeftRangeMargin,
          });
        } else {
          console.error("Slider value is invalid.");
        }
      } else {
        console.error("Total range width is less than the track width.");
      }
    },
    moveButton(buttonType, direction, pixels) {
      let newRangeWidth, newLeftRangeMargin, newRightRangeMargin;

      switch (buttonType) {
        case "left":
          switch (direction) {
            case "right":
              newRangeWidth = this.calculateRange("minusRangeWidth", pixels);
              newLeftRangeMargin = this.calculateRange(
                "plusLeftRangeMargin",
                pixels
              );
              newRightRangeMargin = this.data.rightRangeMargin;
              break;
            case "left":
              newRangeWidth = this.calculateRange("plusRangeWidth", pixels);
              newLeftRangeMargin = this.calculateRange(
                "minusLeftRangeMargin",
                pixels
              );
              newRightRangeMargin = this.data.rightRangeMargin;
              break;
          }
          this.updateRangeValues(
            newRangeWidth,
            newLeftRangeMargin,
            newRightRangeMargin
          );
          break;

        case "right":
          switch (direction) {
            case "right":
              newRangeWidth = this.calculateRange("plusRangeWidth", pixels);
              newLeftRangeMargin = this.data.leftRangeMargin;
              newRightRangeMargin = this.calculateRange(
                "minusRightRangeMargin",
                pixels
              );
              break;
            case "left":
              newRangeWidth = this.calculateRange("minusRangeWidth", pixels);
              newLeftRangeMargin = this.data.leftRangeMargin;
              newRightRangeMargin = this.calculateRange(
                "plusRightRangeMargin",
                pixels
              );
              break;
          }
          this.updateRangeValues(
            newRangeWidth,
            newLeftRangeMargin,
            newRightRangeMargin
          );
          break;
      }
    },

    // Executes the range callbacks
    handleRangeCallback(callbackType) {
      const { max, min, leftRangeMargin, rightRangeMargin, trackWidth } =
        this.data;

      const totalRangeSize = max - min;
      const leftVal =
        parseInt((leftRangeMargin * totalRangeSize) / trackWidth) + min;
      const trackWidthMinusRightMargin = trackWidth - rightRangeMargin;
      const rightVal =
        parseInt((trackWidthMinusRightMargin * totalRangeSize) / trackWidth) +
        min;

      const callback =
        callbackType === "min"
          ? this.props.onFromCallback
          : this.props.onToCallback;

      if (typeof callback === "function") {
        callback(callbackType === "min" ? leftVal : rightVal);
      } else {
        console.error(`Callback for ${callbackType} is not a function.`);
      }
    },
  },
});
