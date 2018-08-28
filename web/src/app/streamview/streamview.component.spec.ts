import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamviewComponent } from './streamview.component';

describe('StreamviewComponent', () => {
  let component: StreamviewComponent;
  let fixture: ComponentFixture<StreamviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
