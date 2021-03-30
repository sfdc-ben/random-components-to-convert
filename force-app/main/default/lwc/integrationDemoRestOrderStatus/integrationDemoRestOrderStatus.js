import { LightningElement, track, api, wire } from 'lwc'
import getExternalStatus from '@salesforce/apex/orderStatusController.getExternalStatus'

export default class IntegrationDemoRestOrderStatus extends LightningElement {
    @api recordId
    @track loading = false
    @track externalPayload

    connectedCallback() {
        this.loading = true
        this.orderHelper()
    }

    handleRefresh() {
        this.loading = true
        this.orderHelper()
    }

    orderHelper() {
        getExternalStatus({ recordId: this.recordId})
        .then(data => {
            console.log(data)
            this.externalPayload = data
            this.loading = false
        })
        .catch(error => {
            console.log(error)
            this.loading = false
        })
    }

    get orderStatus() {
        return this.externalPayload.status
    }

    get orderTime() {
        return this.externalPayload.timestamp
    }

    get orderMessageId() {
        return this.externalPayload.responseId
    }
}