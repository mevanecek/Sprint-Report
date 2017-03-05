(function() {
    var Ext = window.Ext4 || window.Ext;

    var gridConfig = {
    showPagingToolbar: false,
    showRowActionsColumn: false,
    editable: false,
    model: 'userstory',
    columnCfgs: [
        {
    text: 'Feature',
    width: 100,
    dataIndex: 'FeatureName'
        },
        {
    xtype: 'templatecolumn',
    text: 'ID',
    dataIndex: 'FormattedID',
    width: 70,
    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
        },
        {
    text: 'Name',
    dataIndex: 'Name',
    width: 150
        },
        {
    text: 'Schedule State',
    dataIndex: 'ScheduleState',
    width: 90
        },
        {
    text: 'Points',
    dataIndex: 'PlanEstimate',
    width: 55
        },
        {
    text: 'Planned/Added',
    dataIndex: 'Added',
    width: 70
        },
        {
    text: '# of Tasks',
    dataIndex: 'TaskCount',
    width: 55
        },
        {
    text: '# of Defects',
    dataIndex: 'Defects',
    renderer: function(value) {
        return value.Count;
        },
    width: 55
        },
        {
    text: 'Review Feedback',
    dataIndex: 'Notes',
    width: 270
        }
        ]
    };

    Ext.define('PepsiCo.app.sprintreport.StoryGrid', {
        extend: 'Rally.ui.grid.Grid',
        alias: 'widget.pepsicostorygrid',

        constructor: function(config) {
            this.callParent(gridConfig);
        }
//        setStore: function(records) {
//            Ext.create('Rally.data.custom.Store', {
//                data: records
//            })
//        }
    });
})();

