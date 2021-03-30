import { LightningElement, wire, track, api } from 'lwc';
import getAccount from '@salesforce/apex/serviceCartCreateController.getAccount';
import getProducts from '@salesforce/apex/serviceCartCreateController.getProducts';
import { NavigationMixin } from 'lightning/navigation'

export default class ServiceProductCatalog extends NavigationMixin(LightningElement) {
    @api widgetHeight
    timeout = null
    @track searching = false
    @track saving = false
    @track account
    @track filters = {
        searchTerm: '',
        location: ''
    }
    @track searchResults = []
    @track product
    @track guest = true
    @track store = ''

    connectedCallback() {
        this.accountHelper()
    }

    openProduct() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.product.product.Id,
                actionName: 'view',
            }
        })
    }

    accountHelper() {
        let articleURL = window.location.href
        let index = articleURL.indexOf("001");
        let accountId =  articleURL.slice(index, (index + 18));
        getAccount({recordId: accountId})
            .then(data => {
                this.account = data
            })
            .catch(error => console.log(error))
    }

    refreshAccount() {
        this.accountHelper()
    }

    searchHelper() {
        if (this.filters.searchTerm !== '') {
            this.searching = true
            getProducts({searchTerm: this.filters.searchTerm})
            .then(data => {
                this.searchResults = data
                this.searching = false
            })
            .catch(error => console.log(error))
        }
    }

    handleSearchChange = (e) => {
        this.filters.searchTerm = e.target.value
        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
            this.searchHelper()
            if (this.filters.searchTerm  === '') {
                this.searchResults = []
            }
        },500)
    }

    handleCheckbox() {
        this.guest = !this.guest
    }

    handleLocationChange = (e) => {
        this.filters.location = e.target.value
        clearTimeout(this.timeout)

        this.timeout = setTimeout(() => {
                this.store = this.filters.location
        },500)
        this.filters.location = e.target.value
    }

    handleSelect = (e) => {
        let product = this.searchResults.find(result => {
            return result.product.Id === e.currentTarget.dataset.recordid
        })
        this.product = product
        this.searchResults = []
        this.filters.searchTerm = ''
    }

    get getListboxClass() {
        return (
            'slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid '
        );
    }

    get getDropdownClass() {
        let css = 'slds-var-m-horizontal_small slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ';
        if (this.hasResults) {
            css += 'slds-is-open';
        }
        return css;
    }

    get hasResults() {
        return this.searchResults.length > 0;
    }

    get isVancouver() {
        return this.store === 'Vancouver'
    }
}