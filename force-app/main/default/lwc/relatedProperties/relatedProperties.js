import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getSimilarProperties from '@salesforce/apex/RelatedPropertyController.getSimilarProperties';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const fields = [
    'Property__c.Name',
    'Property__c.Price__c',
    'Property__c.Status__c',
    'Property__c.Beds__c'
]

export default class RelatedProperties extends LightningElement {
    @api recordId;
    @track props;
    @track errorMsg;
    @track property;
    @track price;
    @track beds;
    @track cardTitle;
    @api searchCriteria;
    @api priceRange = '100000';

    @wire(CurrentPageReference) pageRef;

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProperty(value) {
        if(value.data) {
            this.property = value.data;
            this.price = this.property.fields.Price__c.value;
            this.beds = this.property.fields.Beds__c.value;
            this.cardTitle = 'Similar Properties by ' + this.searchCriteria;
        } else if (value.error) {
            console.log("OOOPS: ", value.error)
        }
    }

    @wire(getSimilarProperties, { 
        recordId: '$recordId',
        searchCriteria: '$searchCriteria',
        beds: '$beds',
        price: '$price',
        priceRange: '$priceRange'
     })
    wiredProps(value) {
        this.wiredRecords = value;
        if (value.error) {
            this.errorMsg = value.error;
            console.log("ERROR: ", this.errorMsg);
        } else if (value.data) {
            this.props = value.data;
            console.log("HERE: ", value.data);
        }
    }

    connectedCallback() {
        registerListener('propertyUpdated', this.refreshSelection, this);
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    refreshSelection() {
        refreshApex(this.wiredRecords);
    }

    renderedCallback() {
        this.cardTitle = 'Related Properties by ' + this.searchCriteria;
    }
}