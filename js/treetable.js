function TreeTable(options) {
    var treeTableSelf = this;

    this.defaultOptions = {
        root: "js-treetable",
        node: "js-tree-node",
        branch: "js-tree-branch",
        toggleExpand: "js-toggle-expand",
        expanderCollapser: "js-expand-collapse",
        hiddenChildren: "children-are-invisible"
    }

    this.options = {};

    this._init = function() {
        for (var optionName in treeTableSelf.defaultOptions) {
            if (!options[optionName]) {
                treeTableSelf.options[optionName] = treeTableSelf.defaultOptions[optionName];
            } else {
                treeTableSelf.options[optionName] = options[optionName];
            }
        }

        treeTableSelf.refreshTreeBindings();
    }

    /**
     * This function refreshes the bindings on the tree
     * @return {[type]} [description]
     */
    this.refreshTreeBindings = function() {
        // Reveal some random node - this is just for demo purposes - remove in production
        $(".js-reveal-random-node").click(function(){
            var numItemsInTree = $(this).attr("data-max-items");
            treeTableSelf.expandAndCheckTreeNode(treeTableSelf.getRandomNumber(0, numItemsInTree-1));
        });

        // Expand / Collapse All
        $("." + treeTableSelf.options.expanderCollapser).click(function(){
            if($(this).hasClass("js-collapse")) {
                // Collapse
                treeTableSelf.collapseAllTreeNodes();
            } else {
                // Expand
                treeTableSelf.expandAllTreeNodes();
            }
        });

        // Cascade and bubble checks
        $("body").delegate("." + treeTableSelf.options.root + " input:checkbox", "change", function() {
            var val = $(this).prop("checked");
            treeTableSelf.cascadeChecks($(this), val);
            treeTableSelf.bubbleChecks($(this), val);
        });

        // Toggle Expand/Collapse
        $("body").delegate("." + treeTableSelf.options.toggleExpand, "click", function(){
            if($(this).parent().hasClass(treeTableSelf.options.hiddenChildren)) {
                $(this).html("&#x25BC;");
                $(this).parent().removeClass(treeTableSelf.options.hiddenChildren);
            } else {
                $(this).html("&#x25B6;");
                $(this).parent().addClass(treeTableSelf.options.hiddenChildren);
            }
        });
    }

    // This function is just for demo purposes - remove in production
    this.getRandomNumber = function(min, max) {
        return Math.floor(Math.random() * max) + min;
    }

    /**
     * This function resets all the checks in tree
     * @return void
     */
    this.resetTreeChecks = function() {
        $("." + treeTableSelf.options.root + " input:checkbox").prop("checked", false);
    }

    /**
     * This function expands all tree nodes, sets collapse/expand text to collapse, and sets all > to v
     * @return void
     */
    this.expandAllTreeNodes = function() {
        $("." + treeTableSelf.options.expanderCollapser).text("Collapse All");
        $("." + treeTableSelf.options.node).removeClass(treeTableSelf.options.hiddenChildren);
        $("." + treeTableSelf.options.toggleExpand).html("&#x25BC;");
        $("." + treeTableSelf.options.expanderCollapser).removeClass("js-collapse").removeClass("js-expand").addClass("js-collapse");
    }

    /**
     * This functoin collapses all tree nodes, sets collapse/expand text to expand, and sets all v to >
     * @return void
     */
    this.collapseAllTreeNodes = function() {
        $("." + treeTableSelf.options.expanderCollapser).text("Expand All");
        $("." + treeTableSelf.options.node).addClass(treeTableSelf.options.hiddenChildren);
        $("." + treeTableSelf.options.toggleExpand).html("&#x25B6;");
        $("." + treeTableSelf.options.expanderCollapser).removeClass("js-collapse").removeClass("js-expand").addClass("js-expand");
    }

    /**
     * This function collapses all nodes, resets all checks, and then expands and checks a single node
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    this.expandAndCheckTreeNode = function(id) {
        treeTableSelf.collapseAllTreeNodes();
        treeTableSelf.resetTreeChecks();  // Turn this off to expand+reveal multiple items at once, e.g. revealing a previously set list of items
        $("." + treeTableSelf.options.node + "#" + id).parents("." + treeTableSelf.options.node).removeClass(treeTableSelf.options.hiddenChildren).children("." + treeTableSelf.options.toggleExpand).html("&#x25BC;");
        treeTableSelf.cascadeChecks($("." + treeTableSelf.options.node + "#" + id).children("input:checkbox"), true);
        treeTableSelf.bubbleChecks($("." + treeTableSelf.options.node + "#" + id).children("input:checkbox"), true);
    }

    /**
     * This function cascades a check down to children
     * @param  {jQuery object} checkbox The jQuery tree-node object
     * @param  {boolean}       val      The value of the check
     * @return void
     */
    this.cascadeChecks = function(checkbox, val) {
        checkbox.parent().find("input:checkbox").each(function() {
            $(this).prop("checked", val);
        });
    }

    /**
     * This function bubbles a check up through parents (e.g. if all parent children are checked, check the parent)
     * @param  {jQuery object} checkbox The jQuery tree-node object
     * @param  {boolean}       val      The value of the check
     * @return void
     */
    this.bubbleChecks = function(checkbox, val) {
        checkbox.parents("." + treeTableSelf.options.branch).each(function(){
            if($(this).children("." + treeTableSelf.options.node).children("." + treeTableSelf.options.branch).length > 0) {
                var allChecked = $(this).children("." + treeTableSelf.options.node).children("." + treeTableSelf.options.branch).find("input:checkbox:not(:checked)").length == 0;
                $(this).children("." + treeTableSelf.options.node).children("input:checkbox").prop("checked", allChecked);
            }
        });
    }
}