import { LightningElement, wire, track, api } from 'lwc';
import getAccount from '@salesforce/apex/serviceCartCreateController.getAccount';
import getProducts from '@salesforce/apex/serviceCartCreateController.getProducts';
import createOnlineCart from '@salesforce/apex/serviceCartCreateController.createOnlineCart';
import { NavigationMixin } from 'lightning/navigation'

export default class ServiceCartCreate extends NavigationMixin(LightningElement) {
    @api widgetHeight
    timeout = null
    @track searching = false
    @track saving = false
    @track account
    @track filters = {
        searchTerm: ''
    }
    @track searchResults = []
    @track cartItems = []
    @track total = 0
    @track order = null

    connectedCallback() {
        this.accountHelper()
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

    handleSelect = (e) => {
        let product = this.searchResults.find(result => {
            return result.product.Id === e.currentTarget.dataset.recordid
        })
        this.cartItems.push(product)

        this.searchResults = []
        this.filters.searchTerm = ''
        this.calculateTotalHelper()
    }

    onOpenClick = (e) => {
        console.log(e.currentTarget.dataset.openId)
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: e.currentTarget.dataset.openId,
                actionName: 'view',
            }
        })
    }

    onRemoveClick = (e) => {
        console.log(e.currentTarget.dataset.removeId)
        let index = this.cartItems.findIndex(element => {
            return element.product.Id === e.currentTarget.dataset.removeId
        })
        console.log(index)
        this.cartItems.splice(index, 1)
        console.log(this.cartItems)
        this.calculateTotalHelper()
    }

    onDuplicateClick = (e) => {
        console.log(e.currentTarget.dataset.dupeId)
        let item = this.cartItems.find(element => {
            return element.product.Id === e.currentTarget.dataset.dupeId
        })
        console.log(item)
        this.cartItems.push(item)
        this.calculateTotalHelper()
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

    calculateTotalHelper() {
        if (this.cartItems.length === 0) {
            this.total = 0
        } else {
            let itemPrices = this.cartItems.map(item => {
                return item.pbe.UnitPrice
            })
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            let itemTotal = itemPrices.reduce(reducer)
            this.total = itemTotal
        }
    }

    createCart() {
        let cartItems = this.cartItems
        this.saving = true
        createOnlineCart({cartItems, accountId: this.account.Id})
            .then(data => {
                console.log(data)
                this.order = data
                this.saving = false
            })
            .catch(error => console.log(error))
    }

    get getCartQuantity() {
        return this.cartItems.length
    }

    openCart() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.order.Id,
                actionName: 'view',
            }
        })
    }

    resetCart() {
        this.order = null
        this.cartItems = []
        this.total = 0
    }
}