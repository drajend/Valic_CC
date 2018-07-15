import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { SafePipe } from './app.safe.pipe';
import { AppComponent } from './app.component';
import { CreditformComponent } from './creditform/creditform.component';
import { CcapiService } from '../app/services/ccapi.service';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { ModalComponent } from '../app/creditform/modal/modal.component';


@NgModule({
  declarations: [
    AppComponent,    
    ModalComponent,
    routingComponents      
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  entryComponents: [ModalComponent],
  providers: [CcapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
