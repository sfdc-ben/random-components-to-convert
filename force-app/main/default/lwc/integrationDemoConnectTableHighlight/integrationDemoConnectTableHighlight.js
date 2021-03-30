import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'

export default class IntegrationDemoConnectTableHighlight extends NavigationMixin(LightningElement) {
    @api orderHighlight

    openOrder() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.orderHighlight.order.Id,
                actionName: 'view',
            }
        })
    }
}