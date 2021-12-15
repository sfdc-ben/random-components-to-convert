import { LightningElement, api } from 'lwc';

export default class FlowHeader extends LightningElement {
    @api iconName = "standard:flow"
    @api header
}