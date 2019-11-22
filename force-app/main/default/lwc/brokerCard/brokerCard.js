import { LightningElement, api, track, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Broker__c.Name';
import TITLE_FIELD from '@salesforce/schema/Broker__c.Title__c';
import PHONE_FIELD from '@salesforce/schema/Broker__c.Phone__c';
import MOBILE_FIELD from '@salesforce/schema/Broker__c.Mobile_Phone__c';
import EMAIL_FIELD from '@salesforce/schema/Broker__c.Email__c';

const fields = [
    'Property__c.Name',
    'Property__c.Broker__c'
]

export default class BrokerCard extends LightningElement {
    @api recordId;
    @track brokerFields = [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, MOBILE_FIELD, EMAIL_FIELD];

    @wire(getRecord, { recordId: '$recordId', fields }) property;

    get propertyName () {
        let propName = getFieldValue(this.property.data, 'Property__c.Name');
        return "Broker for " + propName;
    }

    get brokerId () {
        return getFieldValue(this.property.data, 'Property__c.Broker__c');
    }
    
    fireToast() {
        const evt = new ShowToastEvent({
            title: "Success!",
            message: "The Broker's record has been successfully saved.",
            variant: "success",
        });
        this.dispatchEvent(evt);
    }
}