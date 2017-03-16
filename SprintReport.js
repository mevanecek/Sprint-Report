(function() {
    var Ext = window.Ext4 || window.Ext;

    const REPORT_WIDTH = 1024;

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
                text: 'Print',
                handler: this._printPage,
                scope: me,
                //                    plugins: [ { ptype: 'rallyprint', defaultTitle: 'Sprint Report'} ],
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
            //            var print = Ext.create('Rally.ui.plugin.print.Print', {
            //                defaultTitle: 'Sprint Report'
            //            });
            //            print.setCmp(this);
            //            print.openPrintPage();
            console.log('This = %o\n', this);
            console.log('HTML = \n%o\n', this.metricsRow.getEl().getHTML() + this.storyGrid.getEl().getHTML());
            //            console.log('HTML = \n%o\n', document.documentElement.innerHTML);
            //this.storyGrid.openPrintPage({ defaultTitle: 'Sprint Report' });
            // window.print();
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
            // this.down('#metricsrow').add(this.metricsRow);
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
            // this.iterationInfoRow = this.down('#reportheader').add(row);
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
            // this.down('#chartsrow').add(this.chartsRow);
        },
        /*********************************************************************************
         * End Setup Sprint charts
         *********************************************************************************/

        _loadStoryData: function() {
            this.metricsRow.items.getAt(0).removeAll(true);
            this.metricsRow.items.getAt(1).removeAll(true);
            this.metricsRow.items.getAt(2).removeAll(true);
            this.storyTable = null;
            this.storyPointsTable = null;
            this.tasksTable = null;

            if (this.storyGrid) {
                this.storyGrid.removeAll();
                this.storyGrid.close();
                this.remove(this.storyGrid);
            }

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
            //            gridConfig.store = records;

            this.storyGrid = Ext.create('PepsiCo.app.sprintreport.StoryGrid', { store: records, width: REPORT_WIDTH });
            // this.down('#storiesrow').add(grid);
            this.sprintReportPanel.addStories(this.storyGrid);
        },

        _loadStoryMetrics: function() {
            this._loadStoryCounts();
            this._loadStoryPoints();
            this._loadTaskHours();
        },

        _loadStoryCounts: function() {
            if (this.storyTable === null) {
                this.storyTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                    storyCount: this.stories.storyCount,
                    storiesAdded: this.stories.storiesAdded,
                    storiesAccepted: this.stories.storiesAccepted,
                    storiesIncomplete: this.stories.storiesIncomplete,
                    storiesPercent: this.stories.storiesPercent,
                    labelColumnTitle: 'Story Counts',
                    valueColumnTitle: 'Value',
                    store: Ext.create('Ext.data.Store', {
                        model: 'Values',
                        fields: ['metricType', 'metricValue'],
                        data: [
                            { 'metricType': '# Stories Planned', 'metricValue': this.stories.storyCount.toString() },
                            { 'metricType': '# Stories Added', 'metricValue': this.stories.storiesAdded.toString() },
                            { 'metricType': '# Stories Accepted', 'metricValue': this.stories.storiesAccepted.toString() },
                            { 'metricType': '# Stories Not Completed', 'metricValue': this.stories.storiesIncomplete.toString() },
                            { 'metricType': '% Stories Accepted', 'metricValue': this.stories.storiesPercent.toString() + '%' }
                        ]
                    })
                });
                this.metricsRow.items.getAt(0).add(this.storyTable);
            }
        },

        _loadStoryPoints: function() {
            if (this.storyPointsTable === null) {
                this.storyPointsTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                    labelColumnTitle: 'Story Points',
                    valueColumnTitle: 'Value',
                    store: Ext.create('Ext.data.Store', {
                        model: 'Values',
                        fields: ['metricType', 'metricValue'],
                        data: [
                            { 'metricType': '# Points Planned', 'metricValue': this.stories.storyPoints.toString() },
                            { 'metricType': '# Points Added', 'metricValue': this.stories.storyPointsAdded.toString() },
                            { 'metricType': '# Points Accepted', 'metricValue': this.stories.storyPointsAccepted.toString() },
                            { 'metricType': '# Points Not Completed', 'metricValue': this.stories.storyPointsIncomplete.toString() },
                            { 'metricType': '% Points Completed', 'metricValue': this.stories.storyPointsPercent.toString() + '%' }
                        ]
                    })
                });
                this.metricsRow.items.getAt(1).add(this.storyPointsTable);
            }
        },

        _loadTaskHours: function() {

            var plan = this.stories.plannedHours;
            var todo = this.stories.todoHours;
            var actual = this.stories.actualHours;

            var percent = (plan === 0) ? 0.00 : Math.round((actual / plan) * 100);

            if (this.tasksTable === null) {
                this.tasksTable = Ext.create('PepsiCo.app.sprintreport.StoryMetricStories', {
                    labelColumnTitle: 'Task Hours',
                    valueColumnTitle: 'Value',
                    store: Ext.create('Ext.data.Store', {
                        model: 'Values',
                        fields: ['metricType', 'metricValue'],
                        data: [
                            { 'metricType': 'Planned Task Hours', 'metricValue': plan.toString() },
                            { 'metricType': 'To-Do Task Hours', 'metricValue': todo.toString() },
                            { 'metricType': 'Actual Task Hours', 'metricValue': actual.toString() },
                            { 'metricType': 'Actual/Planned', 'metricValue': percent.toString() + '%' }
                        ]
                    })
                });
                this.metricsRow.items.getAt(2).add(this.tasksTable);
            }
        }

    });
})();