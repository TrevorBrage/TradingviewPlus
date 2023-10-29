const colors: Record<string, number> = {
  "1m": 0,
  "3m": 49,
  "5m": 11,
  "15m": 13,
  "1h": 15,
  "4h": 12,
  "D": 10,
  "W": 18,
}

// All TV default colors
const defaultColors = ["rgb(255, 255, 255)","rgb(209, 212, 220)","rgb(178, 181, 190)","rgb(149, 152, 161)","rgb(120, 123, 134)","rgb(93, 96, 107)","rgb(67, 70, 81)","rgb(42, 46, 57)","rgb(19, 23, 34)","rgb(0, 0, 0)","rgb(242, 54, 69)","rgb(255, 152, 0)","rgb(255, 235, 59)","rgb(76, 175, 80)","rgb(8, 153, 129)","rgb(0, 188, 212)","rgb(41, 98, 255)","rgb(103, 58, 183)","rgb(156, 39, 176)","rgb(233, 30, 99)","rgb(252, 203, 205)","rgb(255, 224, 178)","rgb(255, 249, 196)","rgb(200, 230, 201)","rgb(172, 229, 220)","rgb(178, 235, 242)","rgb(187, 217, 251)","rgb(209, 196, 233)","rgb(225, 190, 231)","rgb(248, 187, 208)","rgb(250, 161, 164)","rgb(255, 204, 128)","rgb(255, 245, 157)","rgb(165, 214, 167)","rgb(112, 204, 189)","rgb(128, 222, 234)","rgb(144, 191, 249)","rgb(179, 157, 219)","rgb(206, 147, 216)","rgb(244, 143, 177)","rgb(247, 124, 128)","rgb(255, 183, 77)","rgb(255, 241, 118)","rgb(129, 199, 132)","rgb(66, 189, 168)","rgb(77, 208, 225)","rgb(91, 156, 246)","rgb(149, 117, 205)","rgb(186, 104, 200)","rgb(240, 98, 146)","rgb(247, 82, 95)","rgb(255, 167, 38)","rgb(255, 238, 88)","rgb(102, 187, 106)","rgb(34, 171, 148)","rgb(38, 198, 218)","rgb(49, 121, 245)","rgb(126, 87, 194)","rgb(171, 71, 188)","rgb(236, 64, 122)","rgb(178, 40, 51)","rgb(245, 124, 0)","rgb(251, 192, 45)","rgb(56, 142, 60)","rgb(5, 102, 86)","rgb(0, 151, 167)","rgb(24, 72, 204)","rgb(81, 45, 168)","rgb(123, 31, 162)","rgb(194, 24, 91)","rgb(128, 25, 34)","rgb(230, 81, 0)","rgb(245, 127, 23)","rgb(27, 94, 32)","rgb(0, 51, 42)","rgb(0, 96, 100)","rgb(12, 50, 153)","rgb(49, 27, 146)","rgb(74, 20, 140)","rgb(136, 14, 79)"]

class ToggleAutoTimeframeColors extends Feature {
  canvas!: HTMLCanvasElement;

  constructor() {
    super(
      'Toggle Auto Timeframe Colors',
      'Automatically changes tool color on click',
      true,
      {
        key: 's',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
    );

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
       let hotkey = {
          key: '',
          ctrl: false,
          shift: false,
          alt: false,
          meta: false,
        };

        // Get label element
        const hotkeyLabel = document.getElementById(`${this.getName()}-hotkey-label`);
        if (!hotkeyLabel) return;

        // Wait for key to be pressed
        hotkeyLabel.innerText = '...';

        const keydownListener = (event: KeyboardEvent) => {
          if (event.key !== 'Meta' && event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt') {
            hotkey.key = event.key;
            hotkey.ctrl = event.ctrlKey;
            hotkey.shift = event.shiftKey;
            hotkey.alt = event.altKey;
            hotkey.meta = event.metaKey;

            event.preventDefault();
          }
        }

        const keyupListener = () => {
          // Update 'this.hotkey' with the newly selected hotkey
          console.log("new hotkey:", hotkey);
          this.setHotkey(hotkey)

          // Re-render menu while maintaining fuzzy search results
          // This is kinda hacky
          const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;
          textBox.dispatchEvent(new InputEvent('input'));

          // Remove event listeners to stop listening for hotkey input
          document.removeEventListener('keydown', keydownListener);
          document.removeEventListener('keyup', keyupListener);
        }

        document.addEventListener('keyup', keyupListener);
        document.addEventListener('keydown', keydownListener);
      }),
      new ContextMenuListItem('Colors', () => {
        // Launch timeframe colors config
        const cm = new ContextMenu([0, 0]);
        
        // Create menu content elment
        const container = document.createElement('div');
        container.className = 'auto-timeframe-colors-context-menu';


        // Get colors from config
        const colors = this.getConfigValue('colors');

        Object.keys(colors).forEach(key => {
          const timeframe = key;
          const colorValue = colors[key];

          const colorContainer = document.createElement('div');


          const colorText = document.createElement('p');
          colorText.innerText = timeframe;
          colorContainer.appendChild(colorText);

          const colorPickerSquare = document.createElement('div');
          colorPickerSquare.className = 'color-square';
          colorPickerSquare.style.background = defaultColors[colorValue];

          colorPickerSquare.addEventListener('click', () => {

            // Inject color picker into menu, replace current element
            const colorPickerContainer = document.createElement('div');
            colorPickerContainer.className = 'color-picker-context-menu';

            defaultColors.forEach((dc, colorIndex) => {
              const colorElement = document.createElement('span');
              colorElement.style.background = dc;
              colorElement.className = 'color-square';
              colorPickerContainer.appendChild(colorElement);
              
              // On color choose
              const colorChooseCb = () => {
                colorPickerCm.destroy();
                colorElement.removeEventListener('click', colorChooseCb);
                this.setColor(timeframe, colorIndex);
                colorPickerSquare.style.background = defaultColors[colorIndex];
              }

              colorElement.addEventListener('click', colorChooseCb);
            });


            //cm.destroy();
            const offset = cm.element.getBoundingClientRect().right - cm.element.getBoundingClientRect().left + 2;
            const colorPickerCm = new ContextMenu([offset, 0]);
            ////colorPickerSquare.innerText = 'test';
            colorPickerCm.renderElement(colorPickerContainer);

            cm.setClickCallback((event: MouseEvent) => {
              // Make it so the main color config menu doesn't close if
              // the user clicks within the color picker menu
              if (colorPickerCm.element != null) {
                if (!(cm.element?.contains(event.target as Node) || colorPickerCm.element.contains(event.target as Node))) {
                  cm.destroy();
                  colorPickerCm.destroy();
                }
              } else {
                if (!(cm.element?.contains(event.target as Node))) {
                  cm.destroy();
                }
              }
            });



            //cm.renderElement(colorPickerContainer);
          });

          colorContainer.appendChild(colorPickerSquare);


          // Append color container
          container.appendChild(colorContainer);
        });

        cm.renderElement(container);
      })
    ]);
  }

  onKeyDown() {};
  onMouseMove() {};
  onKeyUp() {};
  onMouseWheel() {};


  removeColor(key: string) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy.delete(key);
    this.setConfigValue('colors', colorsCopy);
  }

  setColor(timeframe: string, num: number) {
    const colorsCopy = this.getConfigValue('colors');
    colorsCopy[timeframe] = num;
    this.setConfigValue('colors', colorsCopy);
  }

  initDefaultColors() {
    const once = this.getConfigValue('once');

    // Do stuff if it doesn't exist.  
    // Once done, it will save to local storage and won't execute again
    // as long as cookies aren't cleared
    if (once == undefined) {
      console.debug("setting initial values");
      this.setConfigValue('once', true);

      // Default colors
      this.setConfigValue('colors', {
        "1m": 0,
        "3m": 49,
        "5m": 11,
        "15m": 13,
        "1h": 15,
        "4h": 12,
        "D": 10,
        "W": 18,
      });
      this.saveToLocalStorage();
      this.printLocalStorage();
    }
  }

  // On canvas click
  onMouseDown(e: Event) {
    if (!this.isEnabled() || !this.canvas) return;

    // Get current timeframe
    const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
    if (currentTimeframe == null) return;

    // Wait for toolbar
    waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
      // Click Line tool colors on toolbar
      (document.querySelector('[data-name="line-tool-color"]') as HTMLElement).click()
      const allColors = document.querySelectorAll('[data-name="line-tool-color-menu"] div:not([class]) button');
      (allColors[colors[currentTimeframe]] as HTMLElement).click();
    })
  }

  init() {
    this.initDefaultColors();

    // Wait for chart to exist
    waitForElm('.chart-gui-wrapper').then(async (e) => {
      this.canvas = document.querySelectorAll('.chart-gui-wrapper canvas')[1] as HTMLCanvasElement;
    })
  }
}
