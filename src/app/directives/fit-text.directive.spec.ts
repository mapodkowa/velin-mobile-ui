import {FitTextDirective} from './fit-text.directive';

const elRefMock = {
    nativeElement: document.createElement('span')
};

const zoneMock: any = {
    runOutsideAngular: (task: () => void) => {
        if (task) {
            task();
        }
    }
};

describe('FitTextDirective', () => {
    it('should create an instance', () => {
        const directive = new FitTextDirective(elRefMock, zoneMock);
        expect(directive).toBeTruthy();
    });
});
