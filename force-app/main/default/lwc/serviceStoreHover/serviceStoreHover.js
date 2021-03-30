import { LightningElement, track } from 'lwc';
import storeResources from '@salesforce/resourceUrl/HoverComponentAssets';

export default class ServiceStoreHover extends LightningElement {
    
    // Local Variables

    appResources = {
        storeIcon: `${storeResources}/storeIcon.svg`,
        xIcon: `${storeResources}/x.svg`
    }

    // Constructor Variables

    // Tracked Variables
    
    @track isResizing = false
    @track isPositioned = false
    @track isDragging = false
    @track isOpen = false
    @track isConsoleNavigation = true
    @track posX
    @track posY
    @track posXGhost
    @track posYGhost
    @track quarter
    @track widgetHeight = 590
    @track widgetStatus = 'CLOSED'
    
    // Lifecycle Methods

    constructor() {
        super()
        const name = 'utilityPosition'
        this.loadWidgetLocationPoints()

        const handleResize = () => {
            if (!this.isResizing) {
                this.saveOpenClosedStatus()
                this.isResizing = true
            }
        }

        const handleEndResize = () => {
            const widgetSize = 60
            const widgetMargin = 12
            let posX = window.innerWidth - widgetSize - widgetMargin
            let posY = window.innerHeight - widgetSize - widgetMargin
            if (this.isPositioned) {
                posX = this.posX
                posY = this.posY
                this.behavioralPerformanceCheck(posX, posY)
                this.checkToReOpenWidget()
            }
            this.isResizing = false
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("resize", handleEndResize);
    }

    // Helper Methods

    loadWidgetLocationPoints() {
        if (localStorage.getItem("posX") && localStorage.getItem("posY")) {
            const [posX, posY] = this.keepAstroInWindow(localStorage.getItem("posX"), localStorage.getItem("posY"))
            if (posX && posY) {
                this.posX = posX
                this.posY = posY
                this.isPositioned = true
                this.posXGhost = posX
                this.posYGhost = posY
                this.setPositionQuarter(posX, posY)
                this.calcHeight(posY)
            }
        }
    }

    saveWidgetLocationPoints(posX, posY) {
        localStorage.setItem("posX", posX);
        localStorage.setItem("posY", posY);
    }


    saveOpenClosedStatus() {
        if (this.isOpen) {
            this.widgetStatus = 'CLOSED'
            this.isOpen = false
            return true
        }

        return false
    }

    checkToReOpenWidget() {
        this.isOpen = true
        this.widgetStatus = 'OPEN'
    }

    nonDragClick() {
        let current = this.widgetStatus

        if (current === 'OPEN') {
            this.widgetStatus = 'CLOSED'
        } else {
            this.widgetStatus = 'OPEN'
        }
    
        let currenOpen = this.isOpen
        this.isOpen = !currenOpen
    }

    behavioralPerformanceCheck(newPosX, newPosY) {
        const [posX, posY] = this.keepAstroInWindow(newPosX, newPosY)
        this.saveWidgetLocationPoints(posX, posY)
        this.setPositionQuarter(posX, posY)
        this.calcHeight(posY)

        this.posX = posX
        this.posY = posY
    }

    // calculateWidgetHeight(posY) {
    //     this.calcHeight(posY)
    // }

    calculateOffsetXY(e) {
        let offsetX = e.offsetX
        let offsetY = e.offsetY
        const elementClickedIsChild = e.target.dataset.isChild
        if (elementClickedIsChild === "true") {
            offsetX += e.target.offsetLeft
            offsetY += e.target.offsetTop
        }
        return [offsetX, offsetY]
    }

    keepAstroInWindow(posX, posY) {
        const isConsoleNavigation = this.isConsoleNavigation
        const widgetSize = 60;
        const widgetDefaultMargin = 12;
        const consoleBottomBannerHeight = 40;
        const widgetBottomMargin = isConsoleNavigation ? widgetDefaultMargin + consoleBottomBannerHeight : widgetDefaultMargin;

        const w = window.innerWidth
        const h = window.innerHeight

        const minX = widgetDefaultMargin
        const maxX = w - widgetDefaultMargin - widgetSize
        const minY = widgetDefaultMargin
        const maxY = h - widgetBottomMargin - widgetSize
        if (posX < minX) {
            posX = minX
        }
        if (posX > maxX) {
            posX = maxX
        }
        if (posY < minY) {
            posY = minY
        }
        if (posY > maxY) {
            posY = maxY
        }
        
        const posArray = [posX, posY];
        return posArray;
    }

    setPositionQuarter(posX, posY) {
        const w = window.innerWidth
        const h = window.innerHeight
        const posX100 = posX / w * 100
        const posY100 = posY / h * 100
        if (posX100 < 50 && posY100 < 50) {
            this.quarter = "1"
          } else if (posX100 >= 50 && posY100 < 50) {
            this.quarter = "2"
          } else if (posX100 < 50 && posY100 >= 50) {
            this.quarter = "3"
          } else {
            this.quarter = "4"
          }
    }

    calcHeight(posY) {
        const h = window.innerHeight
        const widgetMargin = 15
        const windowMargin = 12
        const circleHeight = 60
        let pixels
        if (posY >= h / 2) {
          pixels = posY - widgetMargin - windowMargin
        } else {
          pixels = h - posY - circleHeight - widgetMargin - windowMargin
        }
        this.widgetHeight = pixels
    }

    // Getter Methods

    get divClass() {
        let divClass = 'staticGhost'
        let varClass = this.isDragging ? ' visible' : ''

        return divClass+varClass
    }

    get divStyle() {
        let falseStyle = `right: ${this.posX}px; bottom: ${this.posY}px;`
        let trueStyle = `left: ${this.posXGhost}px; top: ${this.posYGhost}px;`
        return this.isPositioned === false ? falseStyle : trueStyle
    }

    get widgetClass() {
        return `widget${this.isDragging ? ' dragging' : ''} screenQuarter${this.quarter}`
    }

    get widgetStyle() {
        let falseStyle = `right: ${this.posX}px; bottom: ${this.posY}px;`
        let trueStyle = `left: ${this.posX}px; top: ${this.posY}px;`

        return this.isPositioned === false ? falseStyle : trueStyle
    }

    get sectionClass() {
        return `widgetOverlay widget-${this.widgetStatus}${this.openUp ? '' : ' open-down'}`
    }

    get sectionStyle() {
        console.log('major widget', this.widgetHeight)
        return `height: ${this.widgetHeight}px; width: 500px;`
    }

    // Handler Methods

    handleMouseDown(e) {
        if (e.target.dataset) {
            if (e.target.dataset.authClick === "canClick") {
                let isMouseDown = true;
                let isMouseDownPressed = false;
                let mouseMoveAdded = false;
                let reOpen = false

                const [offsetX, offsetY] = this.calculateOffsetXY(e)

                setTimeout(() => {
                    if (isMouseDown) {
                        isMouseDownPressed = true
                        mouseMoveAdded = true
                        reOpen = this.saveOpenClosedStatus()
                        this.isDragging = true
                        this.posXGhost = this.posX
                        this.posYGhost = this.posY
                        window.addEventListener("mousemove", mouseMoveHandler)
                    }
                }, 180)

                const mouseMoveHandler = (e) => {
                    this.posX = e.clientX - offsetX
                    this.posY = e.clientY - offsetY
                }

                const mouseUpHandler = (e) => {
                    
                    if (mouseMoveAdded) {
                        window.removeEventListener("mousemove", mouseMoveHandler)
                    }
                    window.removeEventListener("mouseup", mouseUpHandler)

                    if (isMouseDown && isMouseDownPressed) {
                        isMouseDown = false
                        isMouseDownPressed = false
                        this.behavioralPerformanceCheck(e.clientX - offsetX, e.clientY - offsetY)
                        if (reOpen === true) {
                            this.checkToReOpenWidget()
                        }
                        this.isDragging = false
                        this.isPositioned = true
                    }

                    if (isMouseDown && !isMouseDownPressed) {
                        isMouseDown = false
                        this.nonDragClick()
                    }
                }
                this.addEventListener("mouseup", mouseUpHandler);
            }
        }
    }

    handleDragStart(e) {
        e.preventDefault();
    }
}