import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class SalesfloorLookbook extends NavigationMixin(LightningElement) {
    openSalesfloor() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: "https://apps.apple.com/us/app/salesfloor/id957494193"
            }
        })
    }
}