public with sharing class serviceCartCreateController {
    @AuraEnabled
    public static Account getAccount(String recordId) {
        return [SELECT Id, Name FROM Account WHERE Id = :recordId];
    }

    @AuraEnabled
    public static list<ProductComposite> getProducts(String searchTerm) {
        searchTerm = '%' + searchTerm + '%';
        list<ProductComposite> returnProducts = new list<ProductComposite>();
        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true AND isActive = true];

        List<Product2> products = [SELECT Id, Name, purl__c, Family, Designed_For_Activity__c, Material__c, Fit_Details__c, Colour__c, Product_Display_Page_URL__c FROM Product2
                WHERE Name LIKE :searchTerm OR Family LIKE :searchTerm ORDER BY Name LIMIT 5];
        
        for (Product2 obj: products) {
            PricebookEntry entry = [SELECT Id, UnitPrice FROM PricebookEntry 
                    WHERE Product2Id = :obj.Id AND Pricebook2Id = :pricebook.Id];
            ProductComposite iterProd = new ProductComposite();
            iterProd.product = obj;
            iterProd.pbe = entry;
            returnProducts.add(iterProd);
        }

        return returnProducts;

    }

    @AuraEnabled
    public static Order createOnlineCart(List<ProductComposite> cartItems, String accountId) {
        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE IsStandard = true AND isActive = true];
        date myDate = date.today();
        date myEndDate = myDate + 5;
        Order thisOrder = new Order(Name='Online Order', EffectiveDate=myDate, EndDate=myEndDate,Status='Draft', Type='Standard', AccountId=accountId, Pricebook2Id=pricebook.Id);
        insert thisOrder;
        system.debug(thisOrder);
        
        list<OrderItem> itemsToAdd = new list<OrderItem>();
        for (ProductComposite obj: cartItems) {
            OrderItem iterItem = new OrderItem(OrderId=thisOrder.Id, Product2Id=obj.product.Id, PricebookEntryId=obj.pbe.Id, UnitPrice=obj.pbe.UnitPrice, Quantity=1);
            itemsToAdd.add(iterItem);
        }
        insert itemsToAdd;
        system.debug(itemsToAdd);

        Order updatedOrder = [SELECT Id, OrderNumber, TotalAmount, EndDate FROM Order WHERE Id = :thisOrder.Id];
        system.debug(updatedOrder);
        return updatedOrder;
    }

    class ProductComposite {
        @AuraEnabled
        public Product2 product{get; set;}
        @AuraEnabled
        public PricebookEntry pbe{get; set;}
    }
    
}
