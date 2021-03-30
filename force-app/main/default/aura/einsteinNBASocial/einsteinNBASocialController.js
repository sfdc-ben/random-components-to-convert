({
    handleClick : function(component, event, helper) {
		var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            pageReference: {
                "type": "standard__component",
    			"attributes": {
        			"componentName": "c__NBAFlowLC"    
    			},
                "state": {}
            },
            focus: true
        })
    }
})
