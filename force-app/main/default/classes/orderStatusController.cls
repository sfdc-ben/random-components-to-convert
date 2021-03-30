public with sharing class orderStatusController {
    @AuraEnabled
    public static ExternalOrder getExternalStatus (string recordId, string orderNumber) {
        
        if (recordId == null || recordId == '') {
            orderNumber = '%' + orderNumber + '%';
            Order order = [SELECT Id FROM Order WHERE OrderNumber LIKE :orderNumber];
            recordId = order.Id;
        }
        
        ExternalOrder thisExternalOrder = new ExternalOrder();
        // Rest Call Out
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://us-central1-example-integration-app.cloudfunctions.net/exampleIntDemo/api/v1/orders/status/'+recordId);
        system.debug(request.getEndpoint());
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        if (response.getStatusCode() == 200) {
            system.debug(response.getBody());
            ExternalOrder o = (ExternalOrder)JSON.deserializeStrict(response.getBody(), ExternalOrder.class);
            thisExternalOrder = o;
        }

        return thisExternalOrder;
    }

    class ExternalOrder {
        @AuraEnabled
        public string status{get; set;}
        @AuraEnabled
        public string responseId{get; set;}
        @AuraEnabled 
        public string timestamp{get; set;}
    }

}