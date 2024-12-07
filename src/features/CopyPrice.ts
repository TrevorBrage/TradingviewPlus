class CopyPrice extends Feature {
  private mousePos: [number, number] = [0, 0];
  
  constructor() {
    super(
      'Copy Price At Ticker',
      'Copies price at cursor position',
      true,
      {
        key: 'c',
        ctrl: true, // Set default to Ctrl + C
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      true
    );
    this.addContextMenuOptions([
    ]);
  }

  onMouseDown() {};

  onKeyUp() {};
  onMouseWheel() {};

  onMouseMove(e: MouseEvent) {
    // Keep track of mouse pos
    this.mousePos = [e.clientX, e.clientY]
  };

  onKeyDown(e: KeyboardEvent) {
      if (this.checkTrigger(e) && this.isEnabled()) {
        // Emit context menu event
        const canvas = document.querySelectorAll('.chart-gui-wrapper canvas')[1];
        canvas.dispatchEvent(new MouseEvent('contextmenu', {"clientX": this.mousePos[0], "clientY": this.mousePos[1]}))

        waitForElm('[data-label="true"]').then(() => {
          const elements = document.querySelectorAll('[data-label="true"]');

          // Loop through context menu to find "Copy price"
          for (var i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (el.innerText.includes("Copy price")) {
              // Get price without read clipboard perms
              //const text = el.innerText;
              //const price = text.substring(text.indexOf("(")+1, text.lastIndexOf(")"));

              // Click copy price
              el.click();
              break;
            }
          }
        })
      }
  };

  init() {}
}
