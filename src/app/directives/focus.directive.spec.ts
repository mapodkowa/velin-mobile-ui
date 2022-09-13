import {FocusDirective} from './focus.directive';

const elRefMock = {
  nativeElement: document.createElement('div')
};

const zoneMock: any = {
  runOutsideAngular: (task: () => void) => {
    if (task) {
      task();
    }
  }
};

const rendererMock: any = {
  selectRootElement: () => {
    return {
      focus: () => {}
    };
  }
};

describe('FocusDirective', () => {
  it('should create an instance', () => {
    const directive = new FocusDirective(elRefMock, zoneMock, rendererMock);
    expect(directive).toBeTruthy();
  });
});
