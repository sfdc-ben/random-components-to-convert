import { LightningElement, api } from 'lwc';

export default class DigitalClosetItem extends LightningElement {
    @api item
    @api selectHandler

    handleItemSelect = () => {
        console.log('selected', this.item)
        this.selectHandler(this.item)
    }
}