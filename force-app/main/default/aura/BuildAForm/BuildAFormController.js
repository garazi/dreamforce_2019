({
    doInit : function (cmp, evt, hpl) {
        var str = cmp.get("v.fieldsToDisplay").replace(/\s+/g,'');        
        var array = str.split(",");
        cmp.set("v.fieldsArray", array)     
    },
    showToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "The record has been updated.",
            "type": "success"
        });
        toastEvent.fire();
    },
})