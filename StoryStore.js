(function() {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('PepsiCo.app.sprintreport.StoryStore', {
        requires: ['Rally.data.wsapi.Store'],

        storyCount: 0,
        storiesAdded: 0,
        storiesAccepted: 0,
        storiesIncomplete: 0,
        storiesPercent: 0.00,

        storyPoints: 0,
        storyPointsAdded: 0,
        storyPointsAccepted: 0,
        storyPointsIncomplete: 0,
        storyPointsPercent: 0.00,

        plannedHours: 0,
        todoHours: 0,
        actualHours: 0,
        actualPlannedPercent: 0.00,

        iterationField: 'Iteration.ObjectID',
        iterationValue: 'Sprint 1',

        storyRecords: null,
        isLoaded: false,

        store: null,

        mixins: {
            observable: 'Ext.util.Observable'
        },

        constructor: function(config) {
            this.mixins.observable.constructor.call(this, config);
            this._resetStoryMetrics();

            if (config.iterationValue) {
                this.iterationValue = config.iterationValue;
            }
            else {
                this.iterationValue = 'Sprint 1';
                this.iterationField = 'Iteration.Name';
            }

            this.addEvents('loaded');
        },

        load: function() {

            if (this.store === null) {
                this.store = Ext.create('Rally.data.wsapi.Store', {
                    model: 'userstory',
                    autoLoad: true,
                    limit: 'Infinity',
                    filters: {
                        property: this.iterationField,
                        value: this.iterationValue
                    },
                    sorters: [{
                        property: 'Rank',
                        direction: 'ASC'
                    }],
                    listeners: {
                        load: this._onDataLoaded,
                        scope: this
                    },
                    fetch: [ 'ObjectID', 'FormattedID', 'Name', 'ScheduleState', 'PlanEstimate', 'Parent', 'Feature', 'Iteration',
                        'Project', 'Notes', 'Tasks', 'Defects', 'State', 'TaskEstimateTotal', 'TaskRemainingTotal', 'TaskActualTotal' ]
                    }
                );
            }
            this.store.load();
        },

        _resetStoryMetrics: function() {

            this.storyCount = 0;
            this.storiesAdded = 0;
            this.storiesAccepted = 0;
            this.storiesIncomplete = 0;
            this.storiesPercent = 0.00;

            this.storyPoints = 0;
            this.storyPointsAdded = 0;
            this.storyPointsAccepted = 0;
            this.storyPointsIncomplete = 0;
            this.storyPointsPercent = 0.00;

            this.plannedHours = 0;
            this.todoHours = 0;
            this.actualHours = 0;
            this.actualPlannedPercent = 0.00;
        },

        _onDataLoaded: function(store, data) {

            if (this.isLoaded) {
               return;
            }

            this.storyRecords = this._loadStoryRecords(store, data);
            this.storyCount = store.count();
            this.storyPoints = store.sum('PlanEstimate');

            var acc = 0;
            var pacc = 0;

            var plan = 0;
            var todo = 0;
            var actual = 0;

            store.data.each(function(item /*, index, totalItems */) {
                if ('Accepted' === item.data['ScheduleState']) {
                    acc++;
                    pacc += item.data['PlanEstimate'];
                }
                plan += (item.data['TaskEstimateTotal']) ? item.data['TaskEstimateTotal'] : 0;
                todo += (item.data['TaskRemainingTotal']) ? item.data['TaskRemainingTotal'] : 0;
                actual += (item.data['TaskActualTotal']) ? item.data['TaskActualTotal'] : 0;

//                console.log('Iteration = %o\n', item.data['Iteration']);
            });

            this.plannedHours = plan;
            this.todoHours = todo;
            this.actualHours = actual;
            
            this.storiesAccepted = acc;
            this.storyPointsAccepted = pacc;

            this.storiesIncomplete = this.storyCount - this.storiesAccepted;
            this.storyPointsIncomplete = this.storyPoints - this.storyPointsAccepted;

            this.storiesPercent = (this.storyCount > 0) ? Math.round((this.storiesAccepted / this.storyCount) * 100) : 0.00;
            this.storyPointsPercent = (this.storyPoints > 0) ? Math.round((this.storyPointsAccepted / this.storyPoints) * 100) : 0.00;

//            console.log('Stories: %o\nPoints: %o\nAccepted: %o\nA Points: %o\nPercent: %o and %o\n',
//                this.storyCount, this.storyPoints, this.storiesAccepted, this.storyPointsAccepted, this.storiesPercent, this.storyPointsPercent);

            this.records = this._loadStoryRecords(store, data);

            this.isLoaded = true;
            this.fireEvent('loaded');
        },


        // Grab the stories from the Store, and apply any adjustments
        // or extra fields needed for the Stories table.
        _loadStoryRecords: function(store, data) {
            var records = _.map(data, function(record) {
                //Perform custom actions with the data here
                //Calculations, etc.

                var fName = "";
                var tCount = 0;

                // Make sure there is data for the record, before trying
                // to use it.
                if (record.get('Feature') !== null) {
                    fName = record.get('Feature').Name;
                }
                if (record.get('Tasks') !== null) {
                    tCount = record.get('Tasks').Count;
                }

                return Ext.apply( {
                    FeatureName: fName,
                    TaskCount: tCount
                }, record.getData());
            });

            return records;
        },

        _getStoryRecordsStore: function() {
            var rawRecords = this._getStoryRecords();
            return Ext.create('Rally.data.custom.Store', {
                data: rawRecords
            });
        },
        
        _getStoryRecords: function() {
            if (this.records === null) {
                this.records = this._loadStoryRecords(this.store, this.store.data);
            }
            return this.records;
        },

    });


})();
