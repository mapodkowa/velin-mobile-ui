import {ImagePipe} from './image.pipe';

const bridgeMock: any = {
  statusBarHeight: 26,
  checkAvailable: () => false
};

describe('ImagePipe', () => {
  it('create an instance', () => {
    const pipe = new ImagePipe(bridgeMock);
    expect(pipe).toBeTruthy();
  });
});
