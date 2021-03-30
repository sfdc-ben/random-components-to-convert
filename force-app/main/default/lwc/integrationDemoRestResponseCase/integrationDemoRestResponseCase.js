import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'Case.Event_Response_Handshake_ID__c',
    'Case.Event_Timestamp_Response_Message__c',
    'Case.Product_Name__c',
    'Case.Priority',
    'Case.Subject'
]

export default class IntegrationDemoRestResponseCase extends LightningElement {
    @api recordId
    thisCase

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({error, data}) {
        if (data) {
            console.log(data)
            this.thisCase = data.fields

        } else if (error) {
            console.log(error)
        }
    }

    get response() {
        return this.thisCase ? this.thisCase.Event_Response_Handshake_ID__c.value : ''
        // return this.thisCase.data.fields.Event_Response_Handshake_ID__c.value
    }

    get message() {
        return this.thisCase ? this.thisCase.Event_Timestamp_Response_Message__c.value : ''
        // return this.thisCase.data.fields.Event_Timestamp_Response_Message__c.value
    }

    get product() {
        return this.thisCase ? this.thisCase.Product_Name__c.value : ''
        // return this.thisCase.data.fields.Product_Name__c.value
    }
    get priority() {
        return this.thisCase ? this.thisCase.Priority.value : ''
        // return this.thisCase.data.fields.Product_Name__c.value
    }

    get subject() {
        return this.thisCase ? this.thisCase.Subject.value : ''
        // return this.thisCase.data.fields.Subject.value
    }

}