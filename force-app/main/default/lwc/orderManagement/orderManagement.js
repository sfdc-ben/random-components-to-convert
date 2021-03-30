import { LightningElement, track, api, wire } from 'lwc';
import getOrderItems from '@salesforce/apex/replacementOrderController.getOrderItems';
import getOpenCase from '@salesforce/apex/replacementOrderController.getOpenCase';
import getOpenOrders from '@salesforce/apex/replacementOrderController.getOpenOrders';
import createReturnOrder from '@salesforce/apex/replacementOrderController.createReturnOrder';
import updateOrder from '@salesforce/apex/replacementOrderController.updateOrder';
import componentInit from '@salesforce/apex/replacementOrderController.componentInit';
import { NavigationMixin } from 'lightning/navigation'


export default class OrderManagement extends NavigationMixin(LightningElement) {
    @api recordId
    @track page = 0
    @track saving = false
    @track returnOrder
    @track queryData
    @track updatedOrder

    connectedCallback() {
        componentInit({recordId: this.recordId})
            .then(data => {
                console.log(data)
                this.queryData = data;
            })
            .catch(error => console.log(error))
    }

    handleClickForwards() {
        this.saving = true
        if (this.page === 0 ) {
            setTimeout(() => {
                this.page++
                this.saving = false
            }, 400)
        } else if (this.page === 1) {
            createReturnOrder({caseId: this.queryData.openCase.Id, orderId: this.recordId, items: [this.queryData.orderItems[0]]})
                .then(data => {
                    this.returnOrder = data
                    this.page++
                    this.saving = false
                })
                .catch(error => console.log(error))
        } else if (this.page === 2) {
            setTimeout(() => {
                this.page++
                this.saving = false
            }, 400)
        } else if (this.page === 3) {
            updateOrder({orderId: this.queryData.openOrders[0].Id, items: [this.queryData.orderItems[0]]})
            .then(data => {
                this.updatedOrder = data
                this.page++
                this.saving = false
            })
            .error(error => console.log(error))
        }
        
    }

    handleClickBackwards() {
        this.saving = true
        setTimeout(() => {
            this.page--
            this.saving = false
        }, 400)
    }

    handleFinish() {
        this.saving = true
        setTimeout(() => {
            this.page = 0
            this.saving = false
        }, 400)
    }

    get workflow() {
        return this.page > 0 && this.page < 4
    }

    get incomplete() {
        return this.page < 4
    }

    get pageZero() {
        return this.page === 0
    }

    get pageOne() {
        return this.page === 1
    }

    get pageTwo() {
        return this.page === 2
    }

    get pageThree() {
        return this.page === 3
    }

    get pageFour() {
        return this.page === 4
    }

    openReturnOrder() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.returnOrder.Id,
                actionName: 'view',
            }
        })
    }

    openOrder() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.updatedOrder.Id,
                actionName: 'view',
            }
        })
    }
}