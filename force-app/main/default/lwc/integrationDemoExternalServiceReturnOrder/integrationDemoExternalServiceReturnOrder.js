import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'ReturnOrder.OMS_Return_Accepted_Date__c',
    'ReturnOrder.OMS_Return_Id__c',
    'ReturnOrder.Status'
]

export default class IntegrationDemoExternalServiceReturnOrder extends LightningElement {
    @api recordId
    returnOrder
    @track loading = false

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({error, data}) {
        if (data) {
            console.log(data)
            this.returnOrder = data.fields

        } else if (error) {
            console.log(error)
        }
    }

    get orderStatus() {
        return this.returnOrder ? this.returnOrder.Status.value : ''
    }

    get orderTime() {
        return this.returnOrder ? this.returnOrder.OMS_Return_Accepted_Date__c.value : ''
    }

    get orderMessageId() {
        return this.returnOrder ? this.returnOrder.OMS_Return_Id__c.value : ''
    }
}