import { LightningElement, api } from 'lwc';

export default class IntegrationDemoConnectTableItem extends LightningElement {
    @api order
    @api handleSelect

    handleItemSelect() {
        this.handleSelect(this.order)
    }
}