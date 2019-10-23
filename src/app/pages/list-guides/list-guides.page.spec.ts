import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGuidesPage } from './list-guides.page';

describe('ListGuidesPage', () => {
  let component: ListGuidesPage;
  let fixture: ComponentFixture<ListGuidesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGuidesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGuidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
