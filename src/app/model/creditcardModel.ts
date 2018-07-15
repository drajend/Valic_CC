export interface CreditCardInfo{
    CreditCardType : string,
    CreditCardNumber  : string,
    ExpirationDate : string,
    ParticipantName : string
    Rank : string
    Response : ResponseMessage
}

export interface ResponseMessage{
    Code : number,
    Message : string,
    Severity : string
}