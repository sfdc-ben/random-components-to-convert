({
    handleClick : function(component, event, helper) {
		var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: `/flow/Return_Instructions?recordId=${this.recordId}`,
            focus: true
        })
    }
})
