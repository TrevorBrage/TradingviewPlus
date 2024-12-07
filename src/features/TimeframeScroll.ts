class TimeframeScroll extends Feature {
  triggerDown = false;
  
  constructor() {
    super(
      'Scroll Timeframes',
      'Allows you to scroll timeframes using a modifier + scroll wheel or the [ ] keys',
      true,
      {
        key: 'Tab',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      false,
      ["Tab", "Scroll", "[", "]"]
    );
    this.addContextMenuOptions([
    ]);
  }

  onMouseDown() {};

  onMouseMove() {};

  onMouseWheel(e: WheelEvent) {
    if (this.triggerDown) {
      document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent('keydown', {'bubbles': true, 'keyCode': 27}));

      // Get each individual timeframe button and convert NodeList to array
      const timeframeButtons = Array.from(document.querySelectorAll('#header-toolbar-intervals > div button'));

      // Get current timeframe
      const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
      if (currentTimeframe == null) return;

      // Get direction of scroll wheel
      const direction = e.deltaY < 0 ? -1 : 1;

      // Get index of current active timeframe in array
      const currentTimeframeIndex = timeframeButtons.map(e => e.className.includes('isActive')).indexOf(true);

      // Calculate new timeframe index based on scroll delta
      const newTimeframeIndex = currentTimeframeIndex + direction;

      // Click the calculated button
      if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length-1) {
        (timeframeButtons[newTimeframeIndex] as HTMLElement).click();
      } 
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.checkTrigger(e)) {
      this.triggerDown = true;
    }

    // Check for '[' or ']' key for scrolling up or down
    let direction: number | undefined;
    if (e.key === '[') {
      direction = -1; // Scroll up
    } else if (e.key === ']') {
      direction = 1; // Scroll down
    }

    if (direction !== undefined) {
      const timeframeButtons = Array.from(document.querySelectorAll('#header-toolbar-intervals > div button'));

      // Get current timeframe
      const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
      if (currentTimeframe == null) return;

      // Get index of current active timeframe in array
      const currentTimeframeIndex = timeframeButtons.map(e => e.className.includes('isActive')).indexOf(true);

      // Calculate new timeframe index based on key press
      const newTimeframeIndex = currentTimeframeIndex + direction;

      // Click the calculated button
      if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length-1) {
        (timeframeButtons[newTimeframeIndex] as HTMLElement).click();
      }
    }
  }

  onKeyUp(e: KeyboardEvent) {
    if (this.checkTrigger(e)) {
      this.triggerDown = false;
    }

    // Release trigger on key up for '[' or ']'
    if (e.key === '[' || e.key === ']') {
      this.triggerDown = false;
    }
  }

  init() {};
}
