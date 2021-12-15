import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class CaseNBA extends NavigationMixin(LightningElement) {
    handleClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/flow/Return_Instructions`
            }
        })
    }
}