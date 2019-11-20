import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import findProperties from '@salesforce/apex/RelatedPropertyController.getSimilarProperties';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

// Import LMS and messageChannel we will be using
import { subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';
import TEST_CHANNEL from "@salesforce/messageChannel/Test__c";

import NAME_FIELD from '@salesforce/schema/Property__c.Name';
import PRICE_FIELD from '@salesforce/schema/Property__c.Price__c';
import STATUS_FIELD from '@salesforce/schema/Property__c.Status__c';
import BEDS_FIELD from '@salesforce/schema/Property__c.Beds__c';
import BATHS_FIELD from '@salesforce/schema/Property__c.Baths__c';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__c';

const fields = [NAME_FIELD,PRICE_FIELD,BEDS_FIELD,STATUS_FIELD,BROKER_FIELD];

export default class RelatedProperties extends LightningElement {
    @api recordId;
    @track props;
    @track errorMsg;
    @track property;
    @track price;
    @track beds;
    @track cardTitle;
    @api searchCriteria;
    @api priceRange;

    // Set message context and subscription object in LMS
    context = createMessageContext();
    subscription = null;

    @wire(getRecord, {recordId: '$recordId', fields})
    wiredProperty(value) {
        if(value.data) {
            this.property = value.data;
            this.price = this.property.fields.Price__c.value;
            this.beds = this.property.fields.Beds__c.value;
        } else if (value.error) {
            console.log("OOOPS: ", value.error)
        }
    }

    @wire(findProperties, {
        recordId: '$recordId',
        priceRange: '$priceRange',
        searchCriteria: '$searchCriteria',
        price: '$price',
        beds: '$beds'
    })
    wiredProps(value) {
        this.wiredRecords = value;
        if (value.error) {
            this.errorMsg = value.error;
            console.log("ERROR: ", this.errorMsg);
        } else if (value.data) {
            this.props = value.data;
        }
    }

    //@wire(CurrentPageReference) pageRef; <-- no longer used. replaced by LMS

    connectedCallback() {
        //registerListener('propertyUpdated', this.refreshSelection, this); <-- replaced by LMS
        
        // check to see if a subscription exists, otherwise create it on the test_channel
        if (this.subscription) {
            return;
        }
        this.subscription = subscribe(this.context, TEST_CHANNEL, this.refreshSelection.bind(this));
    }

    disconnectedCallback() {
        //unregisterAllListeners(this);
        releaseMessageContext(this.context);
    }
    refreshSelection() {
        refreshApex(this.wiredRecords);
    }

    renderedCallback() {
        this.cardTitle = 'Related Properties by ' + this.searchCriteria;
    }
}