import {RandomColorSeedDirective} from './random-color-seed.directive';

const elRefMock = {
    nativeElement: document.createElement('div')
};

function rgb2hex(rgb): string {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x): string {
        return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

describe('RandomColorSeedDirective', () => {
  it('should create an instance', () => {
    const directive = new RandomColorSeedDirective(elRefMock);
    expect(directive).toBeTruthy();
  });

  it('should create backgroundColor with hex color', () => {
      const directive = new RandomColorSeedDirective(elRefMock);
      directive.seed = 'test';
      directive.ngOnInit();

      const color = RandomColorSeedDirective.getRandomColor(directive.seed);
      expect(color.startsWith('#')).toBe(true);
      expect(color.length).toEqual(7);
      expect(rgb2hex(elRefMock.nativeElement.style.backgroundColor).toLowerCase()).toEqual(color.toLowerCase());
  });
});
