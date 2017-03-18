(function() {
    var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     */
    Ext.define("Rally.ui.report.Runner", {
                                     

        constructor: function(config) {
            this.config = config;
        },

        createReportConfig: function () {
            var config = {};
            Ext.Object.each(this.config.reportConfig, function(key, value) {
                if (key !== "report") {
                    config[key.toUpperCase()] = value;
                }
            });

            if(this.config.project) {
                Ext.apply(config, {
                    project: this.config.project,
                    projectScopeUp: this.config.projectScopeUp,
                    projectScopeDown: this.config.projectScopeDown
                });
            }

            var result = {};
            Ext.Object.each(config, function(key, value) {
                if (Rally.util.Ref.isRefUri(value)) {
                    result[key] = Rally.util.Ref.getOidFromRef(value);
                } else if (Ext.isArray(value)) {
                    var refs = _.map(value, function(item) {
                        return (Rally.util.Ref.isRefUri(item))
                          ? Rally.util.Ref.getOidFromRef(item) : item;
                    });
                    result[key] = refs.join(",");
                } else {
                    result[key] = value;
                }
            });

            return result;
        },

        run: function() {
            this.config.showReportCallback(
                    this.config.reportConfig.report.id, this.createReportConfig());
        }
    });
})();

(function() {

    var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     */
    Ext.define('Rally.ui.report.TimeboxRunner', {
        extend:  Rally.ui.report.Runner ,

        constructor: function(config) {
            if (!config.hasOwnProperty(config.timeboxType)) {
                config[config.timeboxType] = 'current';
            }
            this.callParent([config]);
        },

        run: function() {
            var timebox = this.config[this.config.timeboxType];
            if (Ext.isObject(timebox)) {
                if (Rally.util.DateTime.fromIsoString(
                        this.config[this.config.timeboxType][this.config.startDateField]) < new Date()) {
                    if (this.config.projectScopeDown || this.config.projectScopeUp) {
                        Rally.data.ModelFactory.getModel({type: this.config.timeboxType,
                            success: this._queryForSimilarTimeboxes, scope: this});  //TODO handle failure
                    } else {
                        this.config.reportConfig[this.config.timeboxQueryStringParam] =
                                this.config[this.config.timeboxType].ObjectID;
                        this.config.showReportCallback(this.config.reportConfig.report.id, this.createReportConfig());
                    }
                } else {
                    this.config.showMessageCallback(this.config.futureTimeboxMessage);
                }
            } else if (timebox === 'current') {
                var reportConfig = this.createReportConfig();
                reportConfig.project = Rally.util.Ref.getOidFromRef(this.config.project);
                reportConfig.projectScopeUp = this.config.projectScopeUp;
                reportConfig.projectScopeDown = this.config.projectScopeDown;
                reportConfig[this.config.timeboxQueryRequireCurrentParam] = true;
                this.config.showReportCallback(this.config.reportConfig.report.id, reportConfig);
            } else if(timebox === null) {
                this.config.showMessageCallback(this.config.unscheduledBlankSlate);
            } else {
                this.config.showMessageCallback(this.config.noTimeboxesMessage);
            }
        },

        _queryForSimilarTimeboxes: function(model) {
            var storeConfig = {
                requester: this,
                fetch: ['Project'],
                useShallowFetch: true,
                model: model,
                filters: Ext.create('Rally.data.wsapi.Filter', {
                    property: 'Name',
                    operator: '=',
                    value: this.config[this.config.timeboxType].Name
                }).and(Ext.create('Rally.data.wsapi.Filter', {
                    property: this.config.startDateField,
                    operator: '=',
                    value:    this.config[this.config.timeboxType][this.config.startDateField]
                })).and(Ext.create('Rally.data.wsapi.Filter', {
                    property: this.config.endDateField,
                    operator: '=',
                    value:    this.config[this.config.timeboxType][this.config.endDateField]
                })),
                pageSize : 200, //TODO paging
                context : {
                    projectScopeDown: this.config.projectScopeDown,
                    projectScopeUp: this.config.projectScopeUp,
                    project: this.config.project
                }
            };

            var wsapiStore = Ext.create('Rally.data.wsapi.Store', storeConfig);
            wsapiStore.on('load', this._onSimilarTimeboxesRetrieved, this);
            wsapiStore.load();
        },

        _onSimilarTimeboxesRetrieved: function(store) {
            var timeboxes = [];
            var projects = [];

            store.each(function(timebox) {
                var timeboxRef = timebox.get('_ref');
                var project = timebox.get('Project');

                timeboxes.push(Rally.util.Ref.getOidFromRef(timeboxRef));
                projects.push(Rally.util.Ref.getOidFromRef(project._ref));
            });

            this.config.reportConfig[this.config.timeboxQueryStringParam] = timeboxes.join(',');
            this.config.reportConfig.projects = projects.join(',');
            this.config.showReportCallback(this.config.reportConfig.report.id, this.createReportConfig());
        }
    });
})();

(function() {

    var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     */
    Ext.define("Rally.ui.report.IterationRunner", {
        extend:  Rally.ui.report.TimeboxRunner ,
        requires: [],

        constructor: function(reportConfig) {
            var config = {
                timeboxType: "iteration",
                timeboxQueryStringParam: "iterations",
                startDateField: "StartDate",
                endDateField: "EndDate",
                futureTimeboxMessage: "The selected iteration has not yet started.",
                noTimeboxesMessage:
                        'There are no iterations defined in this project. <a href="#" class="addTimeboxLink">Add New Iteration</a>.',
                timeboxQueryRequireCurrentParam: "requireProjectHasCurrentIteration",
                unscheduledBlankSlate: 'No iteration selected.'
            };

            this.callParent([Ext.apply(config, reportConfig)]);
        }
    });
})();

(function() {

    var Ext = window.Ext4 || window.Ext;

    /**
     * @private
     */
    Ext.define("Rally.ui.report.ReleaseRunner", {
        extend:  Rally.ui.report.TimeboxRunner ,
        requires: [],

        constructor: function(reportConfig) {
            var config = {
                timeboxType: "release",
                timeboxQueryStringParam: "releases",
                startDateField: "ReleaseStartDate",
                endDateField: "ReleaseDate",
                futureTimeboxMessage: "The selected release has not yet started.",
                noTimeboxesMessage:
                        'There are no releases defined in this project. <a href="#" class="addTimeboxLink">Add New Release</a>.',
                timeboxQueryRequireCurrentParam: "requireProjectHasCurrentRelease",
                unscheduledBlankSlate: 'No release selected.'
            };

            this.callParent([Ext.apply(config, reportConfig)]);
        }
    });
})();
