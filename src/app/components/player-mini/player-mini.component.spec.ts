import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PlayerMiniComponent} from './player-mini.component';
import {ImagePipe} from '../../pipes/image.pipe';

describe('PlayerMiniComponent', () => {
  let component: PlayerMiniComponent;
  let fixture: ComponentFixture<PlayerMiniComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerMiniComponent, ImagePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
