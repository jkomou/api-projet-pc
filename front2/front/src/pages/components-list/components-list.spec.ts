import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsList } from './components-list';

describe('ComponentsList', () => {
  let component: ComponentsList;
  let fixture: ComponentFixture<ComponentsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
