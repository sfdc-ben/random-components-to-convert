public with sharing class replacementOrderController {
    @AuraEnabled
    public static list<OrderItem> getOrderItems(String recordId) {
        return [SELECT Id, Product_Name__c, Product2Id, Product_Family__c, purl__c, UnitPrice, Quantity, PricebookEntryId
        FROM OrderItem WHERE OrderId = :recordId];
    }

    @AuraEnabled
    public static Case getOpenCase(String recordId) {
        Order order = [SELECT AccountId FROM Order WHERE Id = :recordId];
        Case thisCase = [SELECT Id, CaseNumber, Origin FROM Case WHERE AccountId = :order.AccountId AND Status != 'Closed' ORDER BY CreatedDate DESC LIMIT 1];
        return thisCase;
    }

    @AuraEnabled
    public static list<Order> getOpenOrders(String recordId) {
        Order order = [SELECT AccountId FROM Order WHERE Id = :recordId];
        list<Order> orders = [SELECT Id, OrderNumber, EndDate, Status FROM Order WHERE AccountId = :order.AccountId AND (Status = 'Draft' OR Status = 'Active')
            ORDER BY OrderNumber DESC];
        return orders;
    }

    class MasterReturn {
        @AuraEnabled
        public list<OrderItem> orderItems{get; set;}
        @AuraEnabled
        public Case openCase{get; set;}
        @AuraEnabled
        public list<Order> openOrders{get; set;}
    }

    @AuraEnabled
    public static MasterReturn componentInit (String recordId){
        MasterReturn thisReturn = new MasterReturn();
        Order order = [SELECT AccountId FROM Order WHERE Id = :recordId];
        thisReturn.orderItems = [SELECT Id, Product_Name__c, Product2Id, Product_Family__c, purl__c, UnitPrice, Quantity, PricebookEntryId
        FROM OrderItem WHERE OrderId = :recordId];
        thisReturn.openCase = [SELECT Id, CaseNumber, Origin FROM Case WHERE AccountId = :order.AccountId AND Status != 'Closed' ORDER BY CreatedDate DESC LIMIT 1];
        thisReturn.openOrders = [SELECT Id, OrderNumber, EndDate, Status FROM Order WHERE AccountId = :order.AccountId AND (Status = 'Draft' OR Status = 'Active')];

        return thisReturn;
    }

    @AuraEnabled
    public static ReturnOrder createReturnOrder (String caseId, String orderId, list<OrderItem> items) {
        Order order = [SELECT AccountId FROM Order WHERE Id = :orderId];
        date myDate = date.today();
        date myEndDate = myDate + 10;
        ReturnOrder returnOrder = new ReturnOrder(AccountId=order.AccountId, Person_Account__c=order.AccountId,CaseId=caseId,OrderId=orderId,Status='Submitted', DestinationLocationId='1314x000000xTwsAAE',Expiration_Date__c=myEndDate);
        insert returnOrder;

        List<ReturnOrderLineItem> lineItems = new List<ReturnOrderLineItem>();
        for (OrderItem obj: items) {
            ReturnOrderLineItem iterItem = new ReturnOrderLineItem(ReturnOrderId=returnOrder.Id,Product2Id=obj.Product2Id, QuantityReturned=obj.Quantity, ReasonForReturn='Damaged', RepaymentMethod='Replace',Items_Status__c='Expected', DestinationLocationId='1314x000000xTwsAAE');
            lineItems.add(iterItem);
        }

        insert lineItems;

        ReturnOrder updatedReturnOrder = [SELECT Id, ReturnOrderNumber, Status, Expiration_Date__c FROM ReturnOrder WHERE Id = :returnOrder.Id];
        return updatedReturnOrder;
    }

    @AuraEnabled
    public static Order updateOrder(String orderId, list<OrderItem> items){
        List<OrderItem> lineItems = new List<OrderItem>();
        for (OrderItem obj: items) {
            OrderItem newOrderItem = new OrderItem(OrderId=orderId, Product2Id=obj.Product2Id, PricebookEntryId=obj.PricebookEntryId, UnitPrice=obj.UnitPrice, Quantity=obj.Quantity);
            lineItems.add(newOrderItem);
        }
        system.debug(lineItems);
        insert lineItems;

        Order updatedOrder = [SELECT Id, OrderNumber, TotalAmount, EndDate FROM Order WHERE Id = :orderId];
        system.debug(updatedOrder);
        return updatedOrder;
    }
}
