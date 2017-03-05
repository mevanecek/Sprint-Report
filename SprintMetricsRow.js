(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.apps.sprintreport.SprintMetricsRow', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.sprintrepormetricsrow',
        cls: 'sprint-report-metrics-row',
        width: 915,
        height: 170,
        title: "Sprint Metrics",
        border: 1,
        collapsible: true,
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

