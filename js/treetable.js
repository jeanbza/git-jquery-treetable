function TreeTable(options) {
    var treeTableSelf = this;

    this.defaultOptions = {
        elemClasses: {
            js: {
                root: "js-treetable",
                node: "js-tree-node",
                branch: "js-tree-branch",
                toggleExpand: "js-toggle-expand",
                expanderCollapser: "js-expand-collapse"
            },
            css: {
                hiddenChildren: "children-are-invisible"
            }
        }
    }

    this.options = {};

    this._init = function() {
        treeTableSelf.options = options ? options : treeTableSelf.defaultOptions;
    }

    this._init();

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
        $("." + treeTableSelf.options.elemClasses.js.expanderCollapser).click(function(){
            if($(this).hasClass("js-collapse")) {
                // Collapse
                treeTableSelf.collapseAllTreeNodes();
            } else {
                // Expand
                treeTableSelf.expandAllTreeNodes();
            }
        });

        // Cascade and bubble checks
        $("body").delegate("." + treeTableSelf.options.elemClasses.js.root + " input:checkbox", "change", function() {
            var val = $(this).prop("checked");
            treeTableSelf.cascadeChecks($(this), val);
            treeTableSelf.bubbleChecks($(this), val);
        });

        // Toggle Expand/Collapse
        $("body").delegate("." + treeTableSelf.options.elemClasses.js.toggleExpand, "click", function(){
            if($(this).parent().hasClass(treeTableSelf.options.elemClasses.css.hiddenChildren)) {
                $(this).html("&#x25BC;");
                $(this).parent().removeClass(treeTableSelf.options.elemClasses.css.hiddenChildren);
            } else {
                $(this).html("&#x25B6;");
                $(this).parent().addClass(treeTableSelf.options.elemClasses.css.hiddenChildren);
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
        $("." + treeTableSelf.options.elemClasses.js.root + " input:checkbox").prop("checked", false);
    }

    /**
     * This function expands all tree nodes, sets collapse/expand text to collapse, and sets all > to v
     * @return void
     */
    this.expandAllTreeNodes = function() {
        $("." + treeTableSelf.options.elemClasses.js.expanderCollapser).text("Collapse All");
        $("." + treeTableSelf.options.elemClasses.js.node).removeClass(treeTableSelf.options.elemClasses.css.hiddenChildren);
        $("." + treeTableSelf.options.elemClasses.js.toggleExpand).html("&#x25BC;");
        $("." + treeTableSelf.options.elemClasses.js.expanderCollapser).removeClass("js-collapse").removeClass("js-expand").addClass("js-collapse");
    }

    /**
     * This functoin collapses all tree nodes, sets collapse/expand text to expand, and sets all v to >
     * @return void
     */
    this.collapseAllTreeNodes = function() {
        $("." + treeTableSelf.options.elemClasses.js.expanderCollapser).text("Expand All");
        $("." + treeTableSelf.options.elemClasses.js.node).addClass(treeTableSelf.options.elemClasses.css.hiddenChildren);
        $("." + treeTableSelf.options.elemClasses.js.toggleExpand).html("&#x25B6;");
        $("." + treeTableSelf.options.elemClasses.js.expanderCollapser).removeClass("js-collapse").removeClass("js-expand").addClass("js-expand");
    }

    /**
     * This function collapses all nodes, resets all checks, and then expands and checks a single node
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    this.expandAndCheckTreeNode = function(id) {
        treeTableSelf.collapseAllTreeNodes();
        treeTableSelf.resetTreeChecks();  // Turn this off to expand+reveal multiple items at once, e.g. revealing a previously set list of items
        $("." + treeTableSelf.options.elemClasses.js.node + "#" + id).parents("." + treeTableSelf.options.elemClasses.js.node).removeClass(treeTableSelf.options.elemClasses.css.hiddenChildren).children("." + treeTableSelf.options.elemClasses.js.toggleExpand).html("&#x25BC;");
        treeTableSelf.cascadeChecks($("." + treeTableSelf.options.elemClasses.js.node + "#" + id).children("input:checkbox"), true);
        treeTableSelf.bubbleChecks($("." + treeTableSelf.options.elemClasses.js.node + "#" + id).children("input:checkbox"), true);
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
        checkbox.parents("." + treeTableSelf.options.elemClasses.js.branch).each(function(){
            if($(this).children("." + treeTableSelf.options.elemClasses.js.node).children("." + treeTableSelf.options.elemClasses.js.branch).length > 0) {
                var allChecked = $(this).children("." + treeTableSelf.options.elemClasses.js.node).children("." + treeTableSelf.options.elemClasses.js.branch).find("input:checkbox:not(:checked)").length == 0;
                $(this).children("." + treeTableSelf.options.elemClasses.js.node).children("input:checkbox").prop("checked", allChecked);
            }
        });
    }
}

$(document).ready(function() {
    var tt = new TreeTable();
    tt.refreshTreeBindings();
});