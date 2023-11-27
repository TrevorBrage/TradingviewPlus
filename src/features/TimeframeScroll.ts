class TimeframeScroll extends Feature {
    triggerDown = false;
    
    constructor() {
      const hotkey: Hotkey = {
        key: 'Tab',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      };
  
      super(
        'Scroll Timeframes',
        'Allows you to scroll timeframes using a modifier + scroll wheel',
        true,
        hotkey, // Passing hotkey object here
        Category.TVP,
        false,
        ["Tab", "Scroll"]
      );
      this.addContextMenuOptions([]);
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
  
    // TODO
    // Fix "checkTrigger" to allow for meta keys ( shift, ctrl, etc )
    // instead of having to hardcode it like this
    onKeyDown(e: KeyboardEvent) {
      if (this.checkTrigger(e)) {
        this.triggerDown = true;
      }
    }
  
    onKeyUp(e: KeyboardEvent) {
      if (this.checkTrigger(e)) {
        this.triggerDown = false;
      }
    }
  
    init() {};
  }