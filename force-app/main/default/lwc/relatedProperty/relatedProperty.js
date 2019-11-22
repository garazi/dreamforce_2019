import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { fireEvent } from 'c/pubsub';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

export default class RelatedProperty extends NavigationMixin(LightningElement) {
    @api item;
    @track editMode=false;

    @wire(CurrentPageReference) pageRef;

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

    editRecord() {
        this.editMode = true;
    }

    handleSuccess() {
            const evt = new ShowToastEvent({
                title: "Success!",
                message: "The record has been successfully saved.",
                variant: "success",
            });
            this.dispatchEvent(evt);
            fireEvent(this.pageRef, 'propertyUpdated');
            this.editMode=false;
    }

    handleCancel() {
        this.editMode=false;
    }
}