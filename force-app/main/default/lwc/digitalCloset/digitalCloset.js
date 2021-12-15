import { LightningElement, track, wire, api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getCloset from '@salesforce/apex/digitalClosetController.getCloset';
import getProductFamilies from '@salesforce/apex/digitalClosetController.getProductFamilies';
import createLeaseBrandOrder from '@salesforce/apex/digitalClosetController.createLeaseBrandOrder';

export default class DigitalCloset extends LightningElement {
    @api recordId;
    closetInitList = []
    @track familiesInitList = []
    @track closetItems = []
    @track selectedItem
    @track selectedFamily
    @track productFamilies = [{name: 'All', variant: 'brand'}]

    @track leasedBrands = [
        {
            label: 'Bottega Veneta', value: 'Bottega Veneta'
        },
        {
            label: 'Chanel', value: 'Chanel'
        },
        {
            label: 'Christian Louboutin', value: 'Christian Louboutin'
        },
        {
            label: 'Louis Vuitton', value: 'Louis Vuitton'
        },
    ]

    @track leaseInputs = {
        brand: '""',
        name: '',
        category: '',
        price: 0
    }

    connectedCallback() {
        getProductFamilies()
            .then(data => {
                this.familiesInitList = data.map(item => {
                    return {
                        label: item.Family,
                        value: item.Family
                    }
                })
                this.familiesInitList.shift()

                console.log(this.familiesInitList)
            })
            .catch(error => console.log('error', error))
        
        this.getClosetHelper()
    }

    getClosetHelper = () => {
        getCloset({ recordId: this.recordId})
            .then(data => {
                this.closetItems = []
                console.log('first',this.closetItems)
                this.selectedFamily = 'All'
                console.log('data',data)
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

    handleNameChange = (e) => {
        this.leaseInputs.name = e.target.value
        console.log(this.leaseInputs)
    }

    handlePriceChange = (e) => {
        this.leaseInputs.price = e.target.value
        console.log(this.leaseInputs)
    }

    handleCategoryChange(e) {
        this.leaseInputs.category = e.detail.value;
        console.log(this.leaseInputs)
    }

    handleBrandChange(e) {
        this.leaseInputs.brand = e.detail.value;
        console.log(this.leaseInputs)
    }

    addItem() {
        let leaseInputs = this.leaseInputs
        createLeaseBrandOrder({recordId: this.recordId, name: leaseInputs.name, brand: leaseInputs.brand, category: leaseInputs.category, price: leaseInputs.price})
            .then(data => {
                console.log(data)
                const event = new ShowToastEvent({
                    title: 'Lease Brand Product Added to Closet',
                    message: `A new lease brand product has been added the client's digital closet`,
                    variant: 'success'
                });
                this.closeModal()
                this.dispatchEvent(event)
                this.closetItems = []
                this.getClosetHelper()
                
            })
            .catch(error => console.log(error))
    }
}