import { LightningElement, api, track } from 'lwc';
import getProductFamilies from '@salesforce/apex/digitalClosetController.getProductFamilies';

export default class MarketingCloudISRecos extends LightningElement {
    @api logo
    @api heading
    @api image1
    @api image2
    @api image3
    @api image4
    @api image5
    @api product1
    @api product2
    @api product3
    @api product4
    @api product5
    @api amount1
    @api amount2
    @api amount3
    @api amount4
    @api amount5
    @api link1
    @api link2
    @api link3
    @api link4
    @api link5

    @track familiesInitList = []
    @track updated = false
    @track saving = false

    @track brands = [
        {
            label: 'Alexander McQueen', value: 'Alexander McQueen'
        },
        {
            label: 'Balmain', value: 'Balmain'
        },
        {
            label: 'Bottega Veneta', value: 'Bottega Veneta'
        },
        {
            label: 'Chanel', value: 'Chanel'
        },
        {
            label: 'Christian Louboutin', value: 'Christian Louboutin'
        },
        {
            label: 'Louis Vuitton', value: 'Louis Vuitton'
        },
        {
            label: 'Thom Browne', value: 'Thom Browne'
        },
        {
            label: 'Valentino', value: 'Valentino'
        },
    ]

    connectedCallback() {
        getProductFamilies()
            .then(data => {
                this.familiesInitList = data.map(item => {
                    return {
                        label: item.Family,
                        value: item.Family
                    }
                })
                this.familiesInitList.shift()

                console.log(this.familiesInitList)
            })
            .catch(error => console.log('error', error))
        
    }

    flipUpdated = () => {
        let updated = this.updated
        this.updated = !updated
    }

    openModal = () =>{
        console.log('open')
        this.querySelectorHelper('.modalSection').classList.add('slds-fade-in-open');
        this.querySelectorHelper('.backdropDiv').classList.add('slds-backdrop_open');
      }

    closeModal(){
        console.log('close')
        this.querySelectorHelper('.modalSection').classList.remove('slds-fade-in-open');
        this.querySelectorHelper('.backdropDiv').classList.remove('slds-backdrop_open');
      }

    querySelectorHelper(element){
         return this.template.querySelector(element);
      }

    handleClose = () => {
        this.closeModal()
        this.saving = true
        setTimeout(() => {
            this.flipUpdated()
            this.saving = false
        }, 1000)
    }
}