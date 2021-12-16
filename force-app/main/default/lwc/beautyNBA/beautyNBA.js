import { LightningElement } from 'lwc';

export default class BeautyNBA extends NavigationMixin(LightningElement) {
    handleClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `/flow/Return_Instructions`
            }
        })
    }
}