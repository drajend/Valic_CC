import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { WorkItemData } from '../model/WorkDataModel';
import { CreditCardInfo } from '../model/creditcardModel';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment.dev'
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CcapiService {

  constructor(private http : HttpClient) { }

  getObjectData(workID) : Observable<WorkItemData[]>{
    let url = environment.RestService + "GetObjectData/" + workID + "/" + environment.AppId;    
    return this.http.get<WorkItemData[]>(url)                    
                    .catch(this.errorHandler)            
  }

  getCreditCardInfo(AccountNo,TrnDate,WrkType):Observable<CreditCardInfo[]>{     
    let body = 'Account='+AccountNo+'&TRNDate='+TrnDate+'&WorkType='+WrkType+'';      
    let url = environment.GetCreditCardInfo;
    return this.http.post<CreditCardInfo[]>(url,body,{
                        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
                    })
                    .catch(this.errorHandler)
  }

  public errorHandler(error : HttpErrorResponse){
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.log(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}