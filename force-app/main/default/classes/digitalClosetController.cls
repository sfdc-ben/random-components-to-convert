public with sharing class digitalClosetController {
    @AuraEnabled(cacheable=true)
    public static list<OrderAndItems> getCloset(String recordId) {

        list<OrderAndItems> returnObject = new list<OrderAndItems>();

        list<Order> orders = [SELECT Id, OrderNumber, EndDate
                FROM Order WHERE AccountId = :recordId AND (Status = 'Delivered' OR Status = 'Store Pick-up')
                ORDER BY EndDate ASC];

        system.debug(orders);
        
        for (Order obj: orders) {
            list<OrderItem> orderItems = [SELECT Id, Product_Name__c, Product2Id, Product_Family__c, purl__c, UnitPrice, Quantity
                    FROM OrderItem WHERE OrderId = :obj.Id];
            system.debug(orderItems);
            OrderAndItems iterOAI = new OrderAndItems();
            iterOAI.order = obj;
            iterOAI.items = orderItems;
            returnObject.add(iterOAI);
        }

        system.debug(returnObject);
        return returnObject;
    }

    class OrderAndItems {
        @AuraEnabled
        public Order order{get; set;}
        @AuraEnabled
        public list<OrderItem> items{get; set;}
    }

    @AuraEnabled
    public static list<AggregateResult> getProductFamilies(){
        return [SELECT Family FROM Product2 GROUP BY Family ORDER BY Family];
    }
}

