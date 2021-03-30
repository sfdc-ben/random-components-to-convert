import { LightningElement, api, track } from 'lwc';
import getExternalOrders from '@salesforce/apex/externalObjectOrdersController.getExternalOrders';

export default class IntegrationDemoConnectTable extends LightningElement {
    @api recordId
    @track loading = false
    @track orderHighlight
    @track externalOrders

    connectedCallback() {
        this.loading = true
        this.loadHelper()
    }

    handleRefresh() {
        this.loading = true
        this.loadHelper()
    }

    loadHelper() {
        getExternalOrders({ recordId: this.recordId })
            .then(data => {
                console.log(data)
                this.externalOrders = data
                this.loading = false
            })
            .catch(error => console.log(error))
    }

    handleSetHighlight = (order) => {
        this.orderHighlight = order
    }

}