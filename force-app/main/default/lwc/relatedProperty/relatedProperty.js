import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub'; // being replaced with Lightning Message Service 
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

// Import LMS and messageChannel we will be using
import {
    publish, createMessageContext
} from 'lightning/messageService';
import TEST_CHANNEL from "@salesforce/messageChannel/Test__c";

// Ensure referentail integrity by importing the schema for fields in use
import PRICE_FIELD from '@salesforce/schema/Property__c.Price__c';
import STATUS_FIELD from '@salesforce/schema/Property__c.Status__c';
import BEDS_FIELD from '@salesforce/schema/Property__c.Beds__c';
import BROKER_FIELD from '@salesforce/schema/Property__c.Broker__c';
import BATHS_FIELD from '@salesforce/schema/Property__c.Baths__c';

export default class RelatedProperty extends NavigationMixin(LightningElement) {
    @api item;
    @track propertyFields = [PRICE_FIELD, BEDS_FIELD, BATHS_FIELD, STATUS_FIELD, BROKER_FIELD];

    //@wire(CurrentPageReference) pageRef; <-- this is only used for the pubsub library
    
    // Declare a new context for Lightning Message Service
    context = createMessageContext();

    navigateToRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.item.Id,
                objectApiName: 'Property__c',
                actionName: 'view',
            },
        });
    }

    fireToast() {
        const evt = new ShowToastEvent({
            title: "Success!",
            message: "The record has been successfully saved.",
            variant: "success",
        });
        this.dispatchEvent(evt);
        //fireEvent(this.pageRef, 'propertyUpdated', this); <-- from c/pubsub
        
        // publish the message to the channel
        publish(this.context, TEST_CHANNEL, this);
    }
}