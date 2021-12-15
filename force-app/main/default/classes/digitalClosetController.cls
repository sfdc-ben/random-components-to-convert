public with sharing class digitalClosetController {
    @AuraEnabled
    public static list<OrderAndItems> getCloset(String recordId) {

        list<OrderAndItems> returnObject = new list<OrderAndItems>();

        list<Order> orders = [SELECT Id, OrderNumber, EndDate
                FROM Order WHERE AccountId = :recordId AND (Status = 'Delivered' OR Status = 'Store Pick-up')
                ORDER BY EndDate ASC];

        system.debug(orders);
        
        for (Order obj: orders) {
            list<OrderItem> orderItem = [SELECT Id, Product_Name__c, Product2Id, Product_Family__c, purl__c, UnitPrice, Quantity
                    FROM OrderItem WHERE OrderId = :obj.Id];
            system.debug(orderItem);
            OrderAndItems iterOAI = new OrderAndItems();
            iterOAI.order = obj;
            iterOAI.items = orderItem;
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

    @AuraEnabled
    public static Order createLeaseBrandOrder(String recordId, String name, String brand, String category, Double price){
        Product2 iterProduct = new Product2(Name=name,Family=category,Image_URL__c='https://upload.wikimedia.org/wikipedia/en/0/06/Bottega_Veneta_logo.png');
        insert iterProduct;
        system.debug(iterProduct);
        date myDate = date.today();
        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true AND isActive = true];
        Order newOrder = new Order(Pricebook2Id=pricebook.Id,AccountId=recordId,Status='Delivered',EffectiveDate=myDate);
        insert newOrder;
        system.debug(newOrder);
        PricebookEntry pbe = new PricebookEntry(Pricebook2Id=pricebook.Id,Product2Id=iterProduct.Id,UnitPrice=price,IsActive=true);
        insert pbe;
        system.debug(pbe);
        OrderItem orderItem = new OrderItem(OrderId=newOrder.Id,Product2Id=iterProduct.Id,PricebookEntryId=pbe.Id,UnitPrice=price,Quantity=1,purl__c='https://upload.wikimedia.org/wikipedia/en/0/06/Bottega_Veneta_logo.png',Product_Family__c=category);
        insert orderItem;
        system.debug(orderItem);
        return newOrder;
    }
}

