(function(){

    var Ext = window.Ext4 || window.Ext;

    /**
     * Add print functionality to a Page component that supports the Sprint Report.
     */
    Ext.define('PepsiCo.app.sprintreport.plugin.SprintReportPrint', {
        requires: ['Ext.XTemplate'],
        extend: 'Rally.ui.plugin.print.Print',
        alias: 'plugin.sprintreportprinting',

        topToolbarTpl: Ext.create('Ext.Template',
            '<div class="send-to-printer noprint">',
            '<form>',
            '<input type="button" align="right" value="Print Sprint Report"',
            'onClick="window.print()">',
            '</form>',
            '</div>',
            {
                compiled: true
            }
        ),

        footerTpl: Ext.create('Ext.Template',
            '<div class="footer">',
            '<div class="printed-by">Printed by {user}</div>',
            '<div class="powered-by">Property of {company}</div>',
            '</div>',
            {
                compiled: true
            }
        ),

        init: function(component){
            this.callParent(arguments);
            this.component = component;
        },

        openPrintPage: function(printOptions){
            this.printOptions = printOptions;
            this.printWindow = window.open(Rally.environment.getServer().getContextUrl() + '/blank.html', 'printwindow',"scrollbars=yes");
            //prevent new print windows from overwriting this one
            this.printWindow.name = '';

            this._waitForWindow(this.printWindow, Ext.bind(this._injectPageStructure, this));
        },

        _getHtmlContent: function(dom) {
            var el = Ext.DomHelper.createDom({});
            el.appendChild(Ext.clone(dom));
            return el.innerHTML;
        },

        getContent: function() {
            return this._getHtmlContent(this.component.getEl().dom);
        },

        getTopToolbar: function(){
            return this.topToolbarTpl.apply();
        },

        getHeader: function() {
            return '';
        },

        getFooter: function(){
            var user = Rally.environment.getContext().getUser().getDisplayString();

            return this.footerTpl.apply({
                user: user,
                company: 'PepsiCo, Inc'
            });
        },

        _injectPageStructure: function(){
            this._injectCSS();
            this.printWindow.document.title = this.printOptions.title;

            //i can haz scrollbars in IE?
            if (Ext.isIE) {
                this.printWindow.document.body.id = 'print-dialog-window';
            }

            this.getPageContent(function(html) {
                this._injectContent(html, 'div', {
                    'class': 'print-page'
                });
                // Ext.Function.defer(this._afterContentLoad, 500, this);
            }, this);
        },
    });
})();
