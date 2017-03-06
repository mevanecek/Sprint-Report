(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.IterationInfo', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.iterationinforow',
        cls: 'iterationInfoRow',

        leftPanel: null,
        rightPanel: null,
        renderTo: Ext.getBody(),

        constructor: function() {
            this.callParent(arguments);
        }
    });
})();

