export interface WorkItemData{
    ObjId : string,
    IndexFields : Array<{FieldName : string, FieldValue : string, LOBTranslation : string}>,
    ObjectFields : Array<{FieldName : string, FieldValue : string, LOBTranslation : string}>,        
    Response : ResponseMessage,
    URL : string
}

export interface ResponseMessage{    
    Code : number,
    Message : string,
    Severity : string
}
