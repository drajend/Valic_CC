import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Routes Declarations
import {CreditformComponent} from './creditform/creditform.component';

const routes: Routes = [
  { path: 'CreditCardinfo', component: CreditformComponent  }   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
export const routingComponents = [CreditformComponent]