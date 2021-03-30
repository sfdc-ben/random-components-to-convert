import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { NavigationMixin } from 'lightning/navigation'

export default class MarketingCloudJourneyExplorer extends NavigationMixin(LightningElement) {
    @track suppressed = false
    @track saving = false

    handleSuppress = () => {
        this.saving = true
        setTimeout(() => {
            this.suppressed = true
            const event = new ShowToastEvent({
                title: 'Journey Suppressed',
                message: 'Marketing Cloud Journey has been suppressed: Portland - Pearl District',
            });
            this.dispatchEvent(event);
            this.saving = false
        }, 1000)
    }

    handleResume = () => {
        this.saving = true
        setTimeout(() => {
            this.suppressed = false
            const event = new ShowToastEvent({
                title: 'Journey Resumed',
                message: 'Marketing Cloud Journey has been resumed: Portland - Pearl District',
            });
            this.dispatchEvent(event);
            this.saving = false
        }, 1000)
    }

    openMarketingCloud() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: "https://mc.s4.exacttarget.com/cloud/#app/Journey%20Builder/%23dashboard/view/all-journeys"
            }
        })
    }
}