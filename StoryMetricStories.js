(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.StoryMetricStories', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.storymetricstories',
        cls: 'story-metric-stories',
        width: 250,
        height: 130,
        storyCount: 0,
        layout: {
            type: 'table',
            // The total column count must be specified here
            columns: 2
        },
        defaults: {
            // applied to each contained panel
            bodyStyle: 'padding:2px; font-size: 10px;'
        },
        items: [
        {
            html: 'Story Count',
            cellCls: 'metricHeader',
            bodyStyle: 'color: blue; background-color: lightblue; font-size: 11px;'
        },
        {
            html: 'Value',
            cellCls: 'metricHeader',
            bodyStyle: 'color: blue; background-color: lightblue; font-size: 11px;'
        },
        {
            html: '# Stories Planned:',
            cellCls: 'metricData'
        },
        {
            html: this.storyCount,
            cellCls: 'metricData'
        },
        {
            html: '# Stories Added:',
            cellCls: 'metricData'
        },
        {
            cellCls: 'metricData'
        },
        {
            html: '# Stories Accepted:',
            cellCls: 'metricData'
        },
        {
            cellCls: 'metricData'
        },
        {
            html: '# Stories Incomplete:',
            cellCls: 'metricData'
        },
        {
            cellCls: 'metricData'
        },
        {
            html: '% Stories Completed:',
            cellCls: 'metricData'
        },
        {
            cellCls: 'metricData'
        }
            ],
        renderTo: Ext.getBody()
    });
})();

