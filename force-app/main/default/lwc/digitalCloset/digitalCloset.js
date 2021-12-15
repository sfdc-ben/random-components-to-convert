import { LightningElement, track, wire, api} from 'lwc';
import getCloset from '@salesforce/apex/digitalClosetController.getCloset';
import getProductFamilies from '@salesforce/apex/digitalClosetController.getProductFamilies';

export default class DigitalCloset extends LightningElement {
    @api recordId;
    closetInitList = []
    familiesInitList = []
    @track closetItems = []
    @track selectedItem
    @track selectedFamily
    @track productFamilies = [{name: 'All', variant: 'brand'}]

    connectedCallback() {
        getProductFamilies()
            .then(data => {
                this.familiesInitList = data
            })
            .catch(error => console.log('error', error))
        
        getCloset({ recordId: this.recordId})
            .then(data => {
                data.forEach(iter => {
                    iter.items.forEach(item => {
                        this.closetItems.push({
                            id: item.Id,
                            orderNumber: iter.order.OrderNumber,
                            orderId: iter.order.Id,
                            endDate: iter.order.EndDate,
                            name: item.Product_Name__c,
                            productId: item.Product2Id,
                            family: item.Product_Family__c,
                            image: item.purl__c,
                            price: item.UnitPrice,
                            quantity: item.Quantity
                        })
                        if (!this.productFamilies.some(e => e.name === item.Product_Family__c)) {
                            this.productFamilies.push({
                                name: item.Product_Family__c,
                                variant: 'neutral'
                            })
                        }
                    })
                })
                this.closetInitList = this.closetItems
                console.log(this.closetItems)
            })
            .catch(error => console.log('error', error))
    }

    Shirt

    setActiveItem = (item) => {
        console.log('received', item)
        this.selectedItem = item
    }

    handleClick = (e) => {
        let button = e.target.name
        this.selectedFamily = button
        console.log(button)
        if (button === 'All') {
            this.closetItems = this.closetInitList
        } else {
            this.closetItems = this.closetInitList.filter(item => {
                return item.family === button
            })
        }
        let index = this.productFamilies.findIndex(e => {
            return e.variant === 'brand'
        })
        console.log(index)
        this.productFamilies[index].variant = 'neutral'

        let index2 = this.productFamilies.findIndex(e => {
            return e.name === button
        })
        console.log(index2)
        this.productFamilies[index2].variant = 'brand'
        
    }
       // JS function to open modal window by adding CSS classes
       
       
       openModal = () =>{

        console.log('open')
        this.querySelectorHelper('.modalSection').classList.add('slds-fade-in-open');
        this.querySelectorHelper('.backdropDiv').classList.add('slds-backdrop_open');
      }
      // JS function to close modal window by removing CSS classes
      closeModal(){
        console.log('close')
        this.querySelectorHelper('.modalSection').classList.remove('slds-fade-in-open');
        this.querySelectorHelper('.backdropDiv').classList.remove('slds-backdrop_open');
      }
      // generic function to get return document element
      querySelectorHelper(element){
         return this.template.querySelector(element);
      }
}