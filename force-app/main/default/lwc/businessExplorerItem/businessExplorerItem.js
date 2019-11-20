import { LightningElement, api, track } from 'lwc';

export default class BusinessExplorerItem extends LightningElement {
    @api item;
    @api markers;
    @track singleProp;
    @track myArray = [];

    handleClick() {
        let singleProp = {
            longitude: this.item.location.longitude,
            latitude: this.item.location.latitude,
            title: this.item.name,
            description: this.item.address + ', ' + this.item.city,
            address: this.item.address,
            city: this.item.city,
            state: this.item.state
        };
        const selectEvent = new CustomEvent('select', {
            detail: singleProp
        });
        console.log("PROP: ", singleProp);
        this.dispatchEvent(selectEvent);
    }
}