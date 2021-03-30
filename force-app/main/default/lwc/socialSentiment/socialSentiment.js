import { LightningElement, track, api, wire } from 'lwc';
import getSocialPosts from '@salesforce/apex/socialSentimentController.getSocialPosts';

export default class SocialSentiment extends LightningElement {
    @api recordId
    @track trend = 'Neutral'
    @track sentiment
    @track themes = []
    
    connectedCallback() {
        this.socialPostHelper()
    }

    handleRefresh() {
        this.socialPostHelper()
    }

    socialPostHelper() {
        console.log('getting posts')
        getSocialPosts({caseId: this.recordId})
            .then(data => {
                console.log(data)
                this.themes = []
                if (data.length > 1) {
                    data[0].AnalyzerScore > data[1].AnalyzerScore ? this.trend = 'Postive' : this.trend = 'Negative'
                }
                this.sentiment = data[0].AnalyzerScore
                data.forEach(post => {
                    if (post.AnalyzerScore > 59) {
                        this.themes.unshift({
                            keyword: post.KeywordGroupName,
                            style: 'slds-theme_success slds-var-m-around_x-small'
                        })
                    } else if (post.AnalyzerScore < 41) {
                        this.themes.unshift({
                            keyword: post.KeywordGroupName,
                            style: 'slds-theme_error slds-var-m-around_x-small'
                        })
                    } else {
                        this.themes.unshift({
                            keyword: post.KeywordGroupName,
                            style: 'slds-theme_warning slds-var-m-around_x-small'
                        })
                    }
                })
                console.log(this.trend, this.sentiment, this.themes)
                
            })
            .catch(error => console.log(error))
    }

    get progressStyle() {
        if (this.sentiment > 59){
            return `width: ${this.sentiment}%; background-color: #027e46!important`
        } else if (this.sentiment < 41) {
            return `width: ${this.sentiment}%; background-color: #c23934!important`
        } else {
            return `width: ${this.sentiment}%; background-color: #ff9a3c!important`
        }
    }

    get trendStyle() {
        if (this.trend === 'Positive') {
            return 'up'
        }  else if (this.trend === 'Negative') {
            return 'down'
        } else {
            return ''
        }
    }

    get sentStyle() {
        if (this.sentiment > 59){
            return `color: #027e46!important`
        } else if (this.sentiment < 41) {
            return `color: #c23934!important`
        } else {
            return `color: #ff9a3c!important`
        }
    }
}
