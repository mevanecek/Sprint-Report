(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.ReleaseCfd', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.releasecfdreport',
    cls: 'iterationInfoRow',
    requires: [ 'Rally.data.wsapi.Store' ]
    });
});
