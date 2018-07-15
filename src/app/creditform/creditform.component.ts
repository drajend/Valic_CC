import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CcapiService } from '../services/ccapi.service';
import { Alert } from 'selenium-webdriver';
import { element, $$ } from 'protractor';
import { WorkItemData } from '../model/WorkDataModel';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-creditform',
  templateUrl: './creditform.component.html',
  styleUrls: ['./creditform.component.css']
})
export class CreditformComponent implements OnInit {

  //Card Header
  public CardHeader="Credit Card Info"

  //Label display text
  public CCType = "Credit Card Type:";
  public CCNumber = "Credit Card #:";
  public CCExpire = "Expiration Date:";

  //Label display value
  public CCTypeValue = "American Express";
  public CCNumberValue = "1234-5678-9012-3456";
  public CCExpireValue = "12-29-2099";

  //Button display text
  public btnName = "EXIT";

  //Work item's Data
  public workData : any

  //Credit card information
  public CreditCardData : any

  //get credit card info - input
  public cAccount : any
  public cWorkType : any
  public cTRNDate : any

  //get credit card info data - OutPut
  public AccountNo = "";
  public CardType = "";
  public ExpDate = "";

  //get Work Item's data - Input
  public ObjID : any

  //get workItem's data - OutPut
  public oWorkType = "";
  public oPolicy = "";
  public oPllDate = "";
  public oPllTime  = "";
  public dateParse = new Date();

  //Error message
  public ErrorMsg

  //get work item's id from URL
  public objID : any

  //flag for calling credit card info
  public ccinfoFlag


  constructor(private _CreditCardService : CcapiService,private _modalService: NgbModal) { }

  //Convert date to mm/dd/yyy format
  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [ pad(d.getMonth()+1),pad(d.getDate()), d.getFullYear()].join('/');
  }

  parseLocation = function(location) {    
    var pairs = location.substring(1).split("&");
    var obj = {};
    var pair;
    var i;

    for ( i in pairs ) {
      if ( pairs[i] === "" ) continue;

      pair = pairs[i].split("=");
      obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );      
    }      
    return obj;
  }

  formatAMPM(value){
    let varAmPm= parseInt(value) > 12 ? "PM" : "AM";
    return varAmPm;
  }

  //credit card number format and decryption
  ccNumFormat(ccOldNumber,ccType){
    let ccNewNumber = "";
    let ccNumber = "";
    for (let index = 0; index < ccOldNumber.length; index++) {      
      if(index<10){
        ccNumber = ccNumber + "*"
      }
    }     
    ccNumber = ccNumber + ccOldNumber.substring(10,ccOldNumber.length);
    if(ccType == "American Express"){
      if(ccNumber.length > 0){
        ccNewNumber = ccNumber.substring(0,4)+ "-" +
                          ccNumber.substring(4,10)+ "-" +
                          ccNumber.substring(10,15);    
      }
    }else{
      if(ccNumber.length > 0){
        ccNewNumber = ccNumber.substring(0,4)+ "-" +
                          ccNumber.substring(4,8)+ "-" +
                          ccNumber.substring(8,12)+ "-" +
                          ccNumber.substring(12,16);    
      }
    }
    return ccNewNumber;                      
  }
  
  open(){
    const modalRef = this._modalService.open(ModalComponent,{ size : "sm", backdrop : "static", keyboard : false});
    modalRef.componentInstance.ErrorMsg = this.ErrorMsg;
  }

  ngOnInit() {
    
    this.objID = this.parseLocation(window.location.search)['ObjId']    
    this._CreditCardService.getObjectData(this.objID)  
        .subscribe(
          (data) =>{        
            console.log(data);        
            this.workData = data;
            
            this.workData.IndexFields.forEach(element => {                
              if(element.LOBTranslation == "POLN"){
                this.oPolicy = element.FieldValue;
              }              
              if(element.LOBTranslation == "PSDT"){
                this.oPllDate = this.convertDate(element.FieldValue);
              }
              if(element.LOBTranslation == "PSTM"){
                this.oPllTime = element.FieldValue;
              }
            });
            this.workData.ObjectFields.forEach(element => {
              if(element.FieldName == "typeName"){
                this.oWorkType = element.FieldValue;
              }
            });
            if(this.oPolicy == ""){
              alert("Invalid Account Number.  Please update worktype and reprocess.");
              this.ccinfoFlag = false;
              return;
            } else this.ccinfoFlag = true;
            if(this.oWorkType !="VIPDISBMNT" && this.oWorkType != "VIPLOAN"){
              if(this.oPllDate == ""){
                alert("Invalid Setup Date.  Please update worktype and reprocess.");
                this.ccinfoFlag = false;
                return;
              } else this.ccinfoFlag = true;
              if(this.oPllTime == ""){
                alert("Invalid Setup Time.  Please update worktype and reprocess.");
                this.ccinfoFlag = false;
                return;
              } else {
                this.cTRNDate = this.oPllDate + " " + (this.oPllTime.substring(0,2) + ":" +
                                this.oPllTime.substring(2,4) + ":"  +
                                this.oPllTime.substring(4))+ " " + 
                                this.formatAMPM(this.oPllTime.substring(0,2));
                this.ccinfoFlag = true;                
              }              
            }else{
              this.cTRNDate = " ";
            }                        
            this.cAccount = this.oPolicy;
            this.cWorkType = this.oWorkType;            

            
            if(this.ccinfoFlag != false){
              this._CreditCardService.getCreditCardInfo(this.cAccount,this.cTRNDate,this.cWorkType)
                                    .subscribe((data) => {
                                      console.log(data);
                                      this.CreditCardData = data;                                                                           
                                      this.CardType = this.CreditCardData.CreditCardType;
                                      this.AccountNo = this.ccNumFormat(this.CreditCardData.CreditCardNumber,this.CardType);
                                      this.ExpDate = this.CreditCardData.ExpirationDate;                                       
                                    },
                                    (error) => {
                                      this.ErrorMsg = error;                                      
                                      //alert('getCreditCardInfo Method Error Encountered: ' + error)
                                      this.open()
                                    },
                                      () => {                                          
                                        console.log('getCreditCardInfo success')
                                      }
                                    );
              }
          },
          (error) => alert('getObjectData Method Error Encountered: ' + error),
          () => {            
            console.log('getObjectData success')
          }
         );                            
  }
}
