class ScrollPriceScale extends Feature {
  triggerDown = false;
  heldKeys: Record<string, boolean> = {};
  
  constructor() {
    super(
      'Scroll Price Scale',
      'Allows you to scroll the price scale using a hotkey + the scroll wheel',
      true,
      {
        key: null,
        ctrl: false,
        shift: true,
        alt: false,
        meta: false
      }, Category.TVP,
      false,
      ["Shift", "Scroll"]
    );
    this.addContextMenuOptions([
    ]);
  }


  onMouseDown() {};

  onMouseMove() {};

  onMouseWheel(e: WheelEvent) {
    //console.log(Object.keys(this.heldKeys));
    if (this.triggerDown && (e as WheelEvent).clientX !== 0) {
      // Stop x axis froms scrolling
      e.stopPropagation();

      // Scroll price axis
      document.querySelector('[class="price-axis"]')?.dispatchEvent(new WheelEvent('wheel', {"deltaY": (e as WheelEvent).deltaY*8}));
    }
  }

  // TODO
  // Fix "checkTrigger" to allow for meta keys ( shift, ctrl, etc )
  // instead of having to hardcode it like this

  onKeyDown(e: KeyboardEvent) {
    if (e.key.length > 0)
      this.heldKeys[e.key] = true;

    const condition = (e.key == "Shift")
    if (condition && this.isEnabled() && Object.keys(this.heldKeys).length == 1) {
      this.triggerDown = true;
    } else {
      this.triggerDown = false;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    // When any key is released, remove it from map
    delete this.heldKeys[e.key];

    // Update trigger if only one left is in map ( Shift )
    this.triggerDown = Object.keys(this.heldKeys).length == 1;

    if (e.key == "Shift") {
      this.triggerDown = false;
    }
  }

  init() {};
}