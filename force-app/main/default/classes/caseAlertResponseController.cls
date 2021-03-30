public with sharing class caseAlertResponseController {
    @InvocableMethod(label='Send Alert Outbound')
    public static List<String> caseAlertResponseController(List<Alerts> alerts) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://us-central1-example-integration-app.cloudfunctions.net/exampleIntDemo/api/v1/alert');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        String body = '{"AccountName__c":"'+alerts[0].accountName+'", "CaseNumber__c": "'+alerts[0].caseNumber+'", "CaseSubject__c": "'+alerts[0].caseSubject+'", "ProductName__c": "'+alerts[0].productName+'", "Message__c": "'+alerts[0].message+'"}';
        request.setBody(body);
        system.debug(body);
        HttpResponse response = http.send(request);
        // Parse the JSON response
        if (response.getStatusCode() != 201) {
            System.debug('The status code returned was not expected: ' +
                response.getStatusCode() + ' ' + response.getStatus());
        } else {
            System.debug(response.getBody());
            AlertResponse res = (AlertResponse)JSON.deserializeStrict(response.getBody(), AlertResponse.class);
            Case updateCase = new Case(Id=alerts[0].caseId, Event_Response_Handshake_ID__c=res.eventResponseHandshakeId, Event_Timestamp_Response_Message__c=res.eventTimestampResponseMessage);
            update updateCase;
        }

        List<String> strings = new List<String>();
        system.debug(strings);

        return strings;
    }

    public class Alerts {
        @InvocableVariable(required=true)
        public string caseId;
        @InvocableVariable(required=true)
        public string caseNumber;
        @InvocableVariable(required=true)
        public string caseSubject;
        @InvocableVariable(required=true)
        public string productName;
        @InvocableVariable(required=true)
        public string message;
        @InvocableVariable(required=true)
        public string accountName;
    }

    public class AlertResponse {
        public string eventTimestampResponseMessage{get; set;}
        public string eventResponseHandshakeId{get; set;}
    }
}
