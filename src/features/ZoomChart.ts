class ZoomChart extends Feature {
  triggerDown = false;
  
  constructor() {
    super(
      'Zoom Chart',
      'Allows you to zoom both chart axes at once',
      true,
      {
        key: null,
        ctrl: true,
        shift: true,
        alt: false,
        meta: false
      },
      Category.TVP,
      false,
      ["Ctrl", "Shift", "Scroll"]
    );
    this.addContextMenuOptions([
    ]);
  }

  onMouseDown() {};

  onMouseMove() {};

  onMouseWheel(e: WheelEvent) {
    if (this.triggerDown && (e as WheelEvent).clientX !== 0) {
      // Scroll price axis
      document.querySelector('[class="price-axis"]')?.dispatchEvent(new WheelEvent('wheel', {"deltaY": (e as WheelEvent).deltaY*8}));
    }
  }

  // TODO
  // Fix "checkTrigger" to allow for meta keys (shift, ctrl, etc)
  // instead of having to hardcode it like this
  onKeyDown(e: KeyboardEvent) {
    const isShiftCtrl = (e.key === "Shift" && e.ctrlKey) || (e.key === "Control" && e.shiftKey);
    if (isShiftCtrl && this.isEnabled()) {
      this.triggerDown = true;
    }
  }

  // Added handling for both Shift and Control keys
  onKeyUp(e: KeyboardEvent) {
    if (e.key === "Shift" || e.key === "Control") {
      this.triggerDown = false;
    }
  }

  init() {};
}
