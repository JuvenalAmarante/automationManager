import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileViewerItemListComponent } from './file-viewer-item-list.component';

describe('FileViewerItemListComponent', () => {
  let component: FileViewerItemListComponent;
  let fixture: ComponentFixture<FileViewerItemListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileViewerItemListComponent]
    });
    fixture = TestBed.createComponent(FileViewerItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
