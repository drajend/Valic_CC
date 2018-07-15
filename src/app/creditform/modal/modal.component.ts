import {Component, Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  template: `  
    <div class="modal-body  ">
      <p>{{ErrorMsg}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-primary" (click)="exitHandler()">Ok</button>
    </div>
  `
})
export class ModalComponent{
  @Input() ErrorMsg;

  constructor(private activemodal : NgbActiveModal ) { }

  exitHandler(){    
    window.open('', '_self', '');
    window.close();    
  }
}
