(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.apps.sprintreport.SprintMetricsRow', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.sprintrepormetricsrow',
        cls: 'metricsRowPanel',
        width: 915,
        height: 190,
        title: "Sprint Metrics",
        border: 0,
        collapsible: false,
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding: 5px; font-size: 10px;'
        },
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        renderTo: Ext.getBody(), // document.body,
        items: [ {
            xtype: 'panel',
            border: 0,
            flex: 1
        },
        {
            xtype: 'panel',
            border: 0,
            flex: 1
        },
        {
            xtype: 'panel',
            border: 0,
            flex: 1
        } ]
    });
})();

