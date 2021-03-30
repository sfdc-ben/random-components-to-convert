import { LightningElement, track, api } from 'lwc';
import storeResources from '@salesforce/resourceUrl/HoverComponentAssets';

export default class SlsStoreRecordMenu extends LightningElement {
    @api widgetHeight
    @track selectedPage = 1
    @track menuSelected = 0

    connectedCallback() {
        console.log(this.widgetHeight, 'Loading Menu')
        console.log(this.selectedPage)
        console.log(this.menuList)
        console.log(this.pages)
    }

    menu = [
        {
            title: 'Online Cart Builder',
            subtitle: 'Shop on-behalf-of through eCommerce',
            iconName: 'custom:custom93',
            color: '#4CC076',
            clickHandler() {
                this.menuSelected = 1
            }
        },
        {
            title: 'Order History',
            subtitle: 'Manage changes and adjustments to orders',
            iconName: 'standard:individual',
            color: '#759FD9',
            clickHandler() {
                this.menuSelected = 2
            }
        },
        // {
        //     title: 'Digital Closet',
        //     subtitle: 'Explore purchased products and preferences',
        //     iconName: 'standard:instore_locations',
        //     color: '#df6184',
        //     clickHandle: ''
        // },
        // {
        //     title: 'Clienteling',
        //     subtitle: 'Assist with common customer activities',
        //     iconName: 'standard:sales_channel',
        //     color: '#ff9a3c',
        //     clickHandle: ''
        // },
        {
            title: 'Product Catalog',
            subtitle: 'Browse product features and variations',
            iconName: 'standard:catalog',
            color: '#F5A622',
            clickHandler() {
                this.menuSelected = 3
            }
        },
        // {
        //     title: 'Point of Sale',
        //     subtitle: 'Complete a customer transaction',
        //     iconName: 'custom:custom40',
        //     color: '#6bbd6e',
        //     clickHandle: ''
        // },
        {
            title: 'Store Fulfillment',
            subtitle: 'Manage mulit-channel fulfillment orders',
            iconName: 'standard:fulfillment_order',
            color: '#E9696D',
            clickHandler() {
                this.menuSelected = 4
            }
        },
        // {
        //     title: 'Black Books',
        //     subtitle: 'Save and organize customer interactions',
        //     iconName: 'standard:entitlement',
        //     color: '#032e61',
        //     clickHandle: ''
        // },
    ]

    appResources = {
        menuBg: `${storeResources}/lulumanifesto.png`,
    }

    get fullHeight() {
        return this.widgetHeight >= 420
    }

    get mainMenu() {
        return this.menuSelected === 0
    }

    get menuOne() {
        return this.menuSelected === 1
    }

    get menuTwo() {
        return this.menuSelected === 2
    }

    get menuThree() {
        return this.menuSelected === 3
    }

    get menuFour() {
        return this.menuSelected === 4
    }
    
    get menuStyle() {
        return `height: 100%; background-size: cover; background-image: url(${this.appResources.menuBg});`
    }

    get headerStyle() {
        return `background: white;`
    }
    
    get menuList() {
        let startIndex = (this.selectedPage - 1) * 4
        console.log(startIndex)
        let endIndex = (this.selectedPage * 4)
        console.log(endIndex)
        let returnList = this.menu.map(menuItem => {
            return {
                ...menuItem,
                style: `background-color: ${menuItem.color};`
            }
        })
        console.log(returnList)
        return returnList.slice(startIndex, endIndex)
    }

    get pages() {
        let totalPages = Math.ceil(this.menu.length / 4)
        return {
            totalPages,
            pages: this.pageCalc(totalPages),
            currentPageValue: `step${this.selectedPage}`,
            firstPage: this.firstPage(),
            lastPage: this.lastPage(totalPages),
            prevPage: this.prevPage,
            nextPage: this.nextPage
        }
    }

    pageCalc(totalPages) {
        let pageArray = []
        for (let i = 0; i < totalPages; i++) {
            pageArray.push({
                label: `Page ${i + 1}`,
                value: `step${i + 1}`
            })
        }
        return pageArray
    }

    firstPage() {
        return this.selectedPage === 1
    }

    lastPage(totalPages) {
        return this.selectedPage === totalPages
    }

    prevPage() {
        let page = this.selectedPage
        this.selectedPage = page - 1
    }

    nextPage() {
        let page = this.selectedPage
        this.selectedPage = page + 1
    }

    handleMainMenu() {
        this.menuSelected = 0
    }
}