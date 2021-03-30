import { LightningElement, track, api, wire } from 'lwc'
import getExternalStatus from '@salesforce/apex/orderStatusController.getExternalStatus'

export default class OrderSearchUtilityBar extends LightningElement {
    @track orderNumber
    @track loading = false
    @track externalPayload

    handleSearchChange = (e) => {
        this.orderNumber = e.target.value
    }

    connectedCallback() {
        this.loading = true
        this.orderHelper()
    }

    handleRefresh() {
        this.orderNumber = ''
        this.externalPayload = null
    }

    handleClick() {
        this.loading = true
        this.orderHelper()
    }

    orderHelper() {
        getExternalStatus({ recordId: '', orderNumber: this.orderNumber})
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