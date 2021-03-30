public with sharing class externalObjectOrdersController {
    @AuraEnabled
    public static list<OrderHighlight> getExternalOrders(String recordId) {
        list<OrderHighlight> externalOrders = new list<OrderHighlight>();

        list<OMS_Order__x> orders = [SELECT Id, createddate__c, name__c, ordernumber__c, sfid__c, status__c, totalamount__c FROM OMS_Order__x WHERE accountid__c = :recordId ORDER BY createddate__c DESC];

        for (OMS_Order__x obj : orders) {
            OrderHighlight thisOrder = new OrderHighlight();
            list<OMS_Order_Item__x> items = [SELECT Id, product2id__c, product_name_c__c, purl_c__c, quantity__c, sfid__c, unitprice__c, totalprice__c FROM OMS_Order_Item__x WHERE orderid__c	= :obj.sfid__c];
            thisOrder.order = obj;
            thisOrder.items = items;
            externalOrders.add(thisOrder);
        }

        return externalOrders;

    }

    class OrderHighlight {
        @AuraEnabled
        public OMS_Order__x order{get; set;}
        @AuraEnabled
        public list<OMS_Order_Item__x> items{get; set;}
    }
}
