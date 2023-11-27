const colors: Record<string, number> = {
  "1m": 0,
  "3m": 49,
  "5m": 11,
  "15m": 13,
  "1h": 15,
  "4h": 12,
  "D": 10,
  "W": 18,
  "M": 16,
}

// All TV default colors
const defaultColors = ["rgb(255, 255, 255)","rgb(209, 212, 220)","rgb(178, 181, 190)","rgb(149, 152, 161)","rgb(120, 123, 134)","rgb(93, 96, 107)","rgb(67, 70, 81)","rgb(42, 46, 57)","rgb(19, 23, 34)","rgb(0, 0, 0)","rgb(242, 54, 69)","rgb(255, 152, 0)","rgb(255, 235, 59)","rgb(76, 175, 80)","rgb(8, 153, 129)","rgb(0, 188, 212)","rgb(41, 98, 255)","rgb(103, 58, 183)","rgb(156, 39, 176)","rgb(233, 30, 99)","rgb(252, 203, 205)","rgb(255, 224, 178)","rgb(255, 249, 196)","rgb(200, 230, 201)","rgb(172, 229, 220)","rgb(178, 235, 242)","rgb(187, 217, 251)","rgb(209, 196, 233)","rgb(225, 190, 231)","rgb(248, 187, 208)","rgb(250, 161, 164)","rgb(255, 204, 128)","rgb(255, 245, 157)","rgb(165, 214, 167)","rgb(112, 204, 189)","rgb(128, 222, 234)","rgb(144, 191, 249)","rgb(179, 157, 219)","rgb(206, 147, 216)","rgb(244, 143, 177)","rgb(247, 124, 128)","rgb(255, 183, 77)","rgb(255, 241, 118)","rgb(129, 199, 132)","rgb(66, 189, 168)","rgb(77, 208, 225)","rgb(91, 156, 246)","rgb(149, 117, 205)","rgb(186, 104, 200)","rgb(240, 98, 146)","rgb(247, 82, 95)","rgb(255, 167, 38)","rgb(255, 238, 88)","rgb(102, 187, 106)","rgb(34, 171, 148)","rgb(38, 198, 218)","rgb(49, 121, 245)","rgb(126, 87, 194)","rgb(171, 71, 188)","rgb(236, 64, 122)","rgb(178, 40, 51)","rgb(245, 124, 0)","rgb(251, 192, 45)","rgb(56, 142, 60)","rgb(5, 102, 86)","rgb(0, 151, 167)","rgb(24, 72, 204)","rgb(81, 45, 168)","rgb(123, 31, 162)","rgb(194, 24, 91)","rgb(128, 25, 34)","rgb(230, 81, 0)","rgb(245, 127, 23)","rgb(27, 94, 32)","rgb(0, 51, 42)","rgb(0, 96, 100)","rgb(12, 50, 153)","rgb(49, 27, 146)","rgb(74, 20, 140)","rgb(136, 14, 79)"]


class ToggleAutoTimeframeColors extends Feature {
  canvas!: HTMLCanvasElement;

  constructor() {
    super(
      'Auto Timeframe Colors',
      'Automatically changes tool color on click',
      true,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      false
    );

    // The following change addresses redundancy by checking if the 'colors' configuration exists before setting default values
    this.addContextMenuOptions([
      new ContextMenuListItem('Colors', () => {
        // Create new context menu for color picker
        const colorPickerCm = new ContextMenu([0, 0]);

        let selectedTimeframe: string | null = null;
        let selectedColorPickerSquare: HTMLElement | null = null;

        // Callback for color choose
        const colorPickerMenu = this.createColorPickerMenu((colorIndex: number) => {
          if (!selectedTimeframe || !selectedColorPickerSquare) return;
          this.setColor(selectedTimeframe, colorIndex);
          selectedColorPickerSquare.style.background = defaultColors[colorIndex];
          colorPickerCm.hide();
        });

        // Render color picker container
        colorPickerCm.renderElement(colorPickerMenu);
        // Hide initially on open
        colorPickerCm.hide();

        // Get position of dots
        const dots = document.getElementById(`${this.getName()}-svg-dots`);
        if (!dots) return;
        const [x, y] = [dots.getBoundingClientRect().x, dots.getBoundingClientRect().y] 

        // Launch timeframe colors config
        const cm = new ContextMenu([x, y]);

        // Create menu content element
        const container = document.createElement('div');
        container.className = 'auto-timeframe-colors-context-menu';

        // Get colors from config
        const colors = this.getConfigValue('colors');

        // Create each element containing timeframe and color square
        Object.keys(colors).forEach(key => {
          const timeframe = key;
          const colorValue = colors[key];

          // Container to hold each color square for their respective timeframe
          const colorContainer = document.createElement('div');

          // Text containing the timeframe
          const colorText = document.createElement('p');
          colorText.innerText = timeframe;
          colorContainer.appendChild(colorText);

          // The color square itself
          const colorPickerSquare = document.createElement('div');
          colorPickerSquare.className = 'color-square';
          colorPickerSquare.style.background = defaultColors[colorValue];

          // On click, open / create color picker menu
          colorPickerSquare.addEventListener('click', () => {
            selectedColorPickerSquare = colorPickerSquare;
            selectedTimeframe = timeframe;
            colorPickerCm.show();
          });
          
          colorContainer.appendChild(colorPickerSquare);

          
          // Append color container
          container.appendChild(colorContainer);
        });

        cm.renderElement(container);

        // Make it so the main color config menu doesn't close if
        // the user clicks within the color picker menu
        cm.setClickCallback((event: MouseEvent) => {
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


        // Make it so ColorPickerMenu doesn't close if clicking within cm
        colorPickerCm.setClickCallback((event: MouseEvent) => {
          if (!(cm.element?.contains(event.target as Node) || colorPickerCm.element.contains(event.target as Node))) {
            colorPickerCm.destroy();
          }
        });

        /* Update ColorPickerMenu position */
        // Calculate position
        const offset = cm.element.getBoundingClientRect().right - cm.element.getBoundingClientRect().left + 2;
        colorPickerCm.updatePosition([x+offset, y]);
      })
    ]);
  }

  onKeyDown() {}
  onMouseMove() {}
  onKeyUp() {}
  onMouseWheel() {}

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

  // Addresses redundancy by checking if 'colors' configuration exists before setting default values
  initDefaultColors() {
    const once = this.getConfigValue('once');

    // Do stuff if it doesn't exist.  
    // Once done, it will save to local storage and won't execute again
    // as long as cookies aren't cleared
    if (once === undefined) {
      console.debug("Setting initial values");
      this.setConfigValue('once', true);


      const colorsExist = this.getConfigValue('colors');
      if (!colorsExist) {

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
          "M": 16,
        });
        this.saveToLocalStorage();
        this.printLocalStorage();
      }
    }
  }

  createColorPickerMenu(colorChooseCb: Function): HTMLElement {
    // Inject color picker into menu, replace current element
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.className = 'color-picker-context-menu';

    // Create and initialize click even for each color square
    defaultColors.forEach((dc, colorIndex) => {
      const colorElement = document.createElement('span');
      colorElement.style.background = dc;
      colorElement.className = 'color-square';
      colorPickerContainer.appendChild(colorElement);
      
      colorElement.addEventListener('click', () => {colorChooseCb(colorIndex)});
    });

    return colorPickerContainer;
  }

  // On canvas click
  onMouseDown(e: Event) {
    if (!this.isEnabled() || !this.canvas) return;

    // On canvas click
    // Get current timeframe
    const currentTimeframe = document.querySelector('#header-toolbar-intervals div button[class*="isActive"]')?.textContent;
    if (currentTimeframe == null) return;

    // Wait for toolbar
    waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
      // Click Line tool colors on toolbar
      (document.querySelector('[data-name="line-tool-color"]') as HTMLElement).click()
      const allColors = document.querySelectorAll('[data-name="line-tool-color-menu"] div:not([class]) button');
      const local_colors = this.getConfigValue('colors');
      (allColors[local_colors[currentTimeframe]] as HTMLElement).click();
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
