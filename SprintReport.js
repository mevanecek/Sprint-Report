(function() {
    var Ext = window.Ext4 || window.Ext;

    var REPORT_WIDTH = 1024;

    Ext.define('SprintReportApp', {
        extend: 'Rally.app.App',
        componentCls: 'app',
        alias: 'widget.sprintreport',
        cls: 'sprint-report',
        items: [{
                xtype: 'container',
                itemId: 'menubar',
                width: REPORT_WIDTH
            },
            {
                xtype: 'container',
                itemId: 'reportbody'
            }
        ],
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },

        iterationBox: null,
        iterationObjId: null,
        releaseBox: null,
        stories: null,
        iterationInfoRow: null,
        metricsRow: null,
        chartsRow: null,
        storyGrid: null,
        storyTable: null,
        storyPointsTable: null,
        tasksTable: null,

        sprintReportPanel: undefined,

        // Launch the application
        launch: function() {

            this.sprintReportPanel = Ext.create('PepsiCo.app.sprintreport.SprintReportPanel', {});
            this.down('#reportbody').add(this.sprintReportPanel);

            this._createMetricsRow();
            this._createIterationInfo();
            this._createChartsRow();
            this._createIterationComboBox();
            this._createReleaseComboBox();
            this._createPrintButton();

            this.sprintReportPanel.addHeader(this.iterationInfoRow);
            this.sprintReportPanel.addMetrics(this.metricsRow);
            this.sprintReportPanel.addCharts(this.chartsRow);
//            this._addPiChart();
        },

        /*********************************************************************************
         * Add the menubar: Iteration combo box, Release combo box, and print button
         *********************************************************************************/
        // Add the IterationComboBox to the header, and set its listener.
        _createIterationComboBox: function() {
            var me = this;
            this.iterationBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
                listeners: {
                    change: this._iterationChange,
                    scope: me
                },
                style: { float: 'left' }
            });
            this.iterationBox.getStore().load();
            this.down('#menubar').add(this.iterationBox);
        },

        // Add the ReleaseComboBox to the header, and set its listener.
        _createReleaseComboBox: function() {
            var me = this;
            this.releaseBox = Ext.create('Rally.ui.combobox.ReleaseComboBox', {
                listeners: {
                    change: this._releaseChange,
                    scope: me
                }
            });
            this.down('#menubar').add(this.releaseBox);
        },

        // Create a print button
        _createPrintButton: function() {
            var me = this;
            var button = Ext.create('Rally.ui.Button', {
                text: 'Prepare Report for Printing',
                handler: this._printPage,
                scope: me,
                style: { float: 'right' }
            });
            this.down('#menubar').add(button);
        },

        _iterationChange: function(source, newValue /*, oldValue */ ) {
            var objIdArr = newValue.split('/');
            this.iterationObjId = objIdArr[objIdArr.length - 1];

            this.iterationInfoRow._setIterationId(this.iterationObjId);
            this.iterationInfoRow._fetchIteration();

            this.chartsRow.setIterationId(this.iterationObjId);
            this.chartsRow.loadCharts();

            this._loadStoryData();
        },

        _releaseChange: function(source, newValue /*, oldValue */ ) {
            var objIdArr = newValue.split('/');
            var relObjId = objIdArr[objIdArr.length - 1];

            this.chartsRow.setReleaseId(relObjId);
            this.chartsRow.loadCharts();
        },

        _printPage: function() {
            this.sprintReportPanel.openPrintPage({ defaultTitle: 'Sprint Report', title: 'Sprint Report' });
        },
        /*********************************************************************************
         * End Setup Menubar Section
         *********************************************************************************/

        /*********************************************************************************
         * Add the report metrics row, with tables for the metrics to be displayed
         *********************************************************************************/
        // Create and add the metrics row
        _createMetricsRow: function() {
            this.metricsRow = Ext.create('PepsiCo.apps.sprintreport.SprintMetricsRow', { width: REPORT_WIDTH });
        },
        /*********************************************************************************
         * End Setup Metrics Section
         *********************************************************************************/

        /*********************************************************************************
         * Add the sprint informatoin row, with start and end dates and theme
         *********************************************************************************/
        // Create and add the iteration information row
        _createIterationInfo: function() {
            this.iterationInfoRow = Ext.create('PepsiCo.app.sprintreport.IterationInfo', {
                title: 'Sprint Information',
                border: 0,
                margin: '0 0 15 0',
                width: REPORT_WIDTH
            });
        },
        /*********************************************************************************
         * End Setup Sprint Information
         *********************************************************************************/

        /*********************************************************************************
         * Add the sprint burndown and release cumulative flow charts
         *********************************************************************************/
        // Add the row for the charts that will be displayed
        _createChartsRow: function() {
            this.chartsRow = Ext.create('PepsiCo.app.sprintreport.SprintReportCharts', {
                title: 'Progress Charts',
                border: 0,
                margin: '0 0 15 0',
                width: REPORT_WIDTH
            });
        },
        /*********************************************************************************
         * End Setup Sprint charts
         *********************************************************************************/

        _loadStoryData: function() {
            var me = this;
            this.stories = Ext.create('PepsiCo.app.sprintreport.StoryStore', {
                listeners: {
                    loaded: this._loadReportWidgets,
                    scope: me
                },
                iterationValue: this.iterationObjId
            });
            this.stories.load();
        },

        _loadReportWidgets: function() {
            this._loadStoryMetrics();
            this._loadFeatureStoryTable();
        },

        // Load the Story table
        _loadFeatureStoryTable: function() {
            var records = this.stories._getStoryRecordsStore();

            this.storyGrid = Ext.create('PepsiCo.app.sprintreport.StoryGrid', {
                store: records,
                width: REPORT_WIDTH,
                listeners: {
                    viewready: function() {
                                    var gH = this.storyGrid.getHeight();
                                    var vH = this.storyGrid.getView().getHeight();
//                                    console.log('grid height = ' + gH + ' and view height = ' + vH);

                                    var h = (gH < vH) ? vH : gH;
                                    this.storyGrid.getView().setHeight(h);
//                                    this.storyGrid.setHeight(h+75);

                                    gH = this.storyGrid.getHeight();
                                    vH = this.storyGrid.getView().getHeight();
//                                    console.log('grid height = ' + gH + ' and view height = ' + vH);
                    },
                    scope: this

                }
            });
            this.sprintReportPanel.addStories(this.storyGrid);
        },

        _loadStoryMetrics: function() {
            this.metricsRow.setStore(this.stories);
            this.metricsRow.loadStoryCounts();
            this.metricsRow.loadStoryPoints();
            this.metricsRow.loadTaskHours();
        },

        _addPiChart: function() {
            var pi = Ext.create('Rally.example.BurnChart', {
                piOid: 61207323032
            });
            this.sprintReportPanel.addFooter(pi);
            
        }
    });
})();
