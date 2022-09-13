import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PlayerComponent} from './player.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormatTimePipe} from '../../pipes/format-time.pipe';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, NoopAnimationsModule ],
      declarations: [ PlayerComponent, FormatTimePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
