import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class IotAssetLiveData extends LightningElement {
    @track isLoading = false
    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
        this.isLoading = true;
        setTimeout(() => {
            const event = new ShowToastEvent({
                title: 'Live Data Refreshed',
                message: 'Live data for this asset has been received.',
                variant: 'success'
            });
            this.dispatchEvent(event);
            this.isLoading = false
        }, 1000)
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    refreshData() {
        this.isLoading = true;
        setTimeout(() => {
            const event = new ShowToastEvent({
                title: 'Live Data Refreshed',
                message: 'Live data for this asset has been received.',
                variant: 'success'
            });
            this.dispatchEvent(event);
            this.isLoading = false
        }, 1000)
    }



}