import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class DigitalClosetHighlight extends NavigationMixin(LightningElement) {
    @api selectedItem

    openOrder() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.selectedItem.orderId,
                actionName: 'view',
            }
        })
    }

    openProduct() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.selectedItem.productId,
                actionName: 'view',
            }
        })
    }
}