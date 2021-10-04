import { LightningElement, api } from 'lwc';

export default class AcTravelerDetails extends LightningElement {
    @api color = 'black'
    @api headColor = 'black'
    @api deptFlightOrigin
    @api deptFlightDest
    @api deptFlightDate
    @api deptFlightItin
    @api deptFlightDeptTime
    @api deptFlightArrTime
    @api deptFlightDuration
    @api deptFlightStopOver
    @api deptFlightStopOverDuration
    @api deptFlightLeg1Detail
    @api deptFlightLeg2Detail

    @api arrFlightOrigin
    @api arrFlightDest
    @api arrFlightDate
    @api arrFlightItin
    @api arrFlightDeptTime
    @api arrFlightArrTime
    @api arrFlightDuration
    @api arrFlightStopOver
    @api arrFlightStopOverDuration
    @api arrFlightLeg1Detail
    @api arrFlightLeg2Detail

    @api householdImage

    get icnStyle() {
        return `
            --sds-c-icon-color-foreground-default: ${this.color};
            --sds-c-icon-color-foreground: ${this.color};
            --sds-c-icon-color-background: white;
            `
    }

    get headStyle() {
        return `
            background: ${this.headColor};
            `
    }
}