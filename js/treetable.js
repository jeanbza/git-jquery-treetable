function refreshTreeBindings() {
    // Cascade and bubble checks
    $(".js-treetable input:checkbox").change(function() {
        var val = $(this).prop('checked');
        cascadeChecks($(this), val);
        bubbleChecks($(this), val);
    });

    // Toggle Expand/Collapse
    $(".js-toggle-expand").click(function(){
        if($(this).parent().hasClass('children-are-invisible')) {
            $(this).html("&#x25BC;");
            $(this).parent().removeClass('children-are-invisible');
        } else {
            $(this).html("&#x25B6;");
            $(this).parent().addClass('children-are-invisible');
        }
    });

    // Expand / Collapse All
    $(".js-expand-collapse").click(function(){
        if($(this).hasClass('js-collapse')) {
            // Collapse
            collapseAllTreeNodes();
        } else {
            // Expand
            expandAllTreeNodes();
        }
    });
}

function resetTreeChecks() {
    $(".js-treetable input:checkbox").prop('checked', false);
    Webapp.CheckedFilters.clear();
}

function expandAllTreeNodes() {
    $(".js-expand-collapse").text("Collapse All");
    $(".js-tree-node").removeClass("children-are-invisible");
    $(".js-toggle-expand").html("&#x25BC;");
    $(".js-expand-collapse").removeClass('js-collapse').removeClass('js-expand').addClass('js-collapse');
}

function collapseAllTreeNodes() {
    $(".js-expand-collapse").text("Expand All");
    $(".js-tree-node").addClass("children-are-invisible");
    $(".js-toggle-expand").html("&#x25B6;");
    $(".js-expand-collapse").removeClass('js-collapse').removeClass('js-expand').addClass('js-expand');
}

function expandAndCheckTreeNode(id) {
    $(".js-tree-node#"+id).parents(".js-tree-node").removeClass('children-are-invisible').children(".js-toggle-expand").html("&#x25BC;");
    cascadeChecks($(".js-tree-node#"+id).children('input:checkbox'), true);
    bubbleChecks($(".js-tree-node#"+id).children('input:checkbox'), true);
}

function cascadeChecks(checkbox, val) {
    checkbox.parent().find("input:checkbox").each(function() {
        $(this).prop('checked', val);
        var treeNode = $(this).parent();

        if(val) {
            var myObject = Webapp.CheckedFilters.findProperty('id', $(treeNode).attr('id'));
            if(myObject == undefined) {
                addNode(treeNode);
            }
        } else {
            var myObject = Webapp.CheckedFilters.findProperty('id', $(treeNode).attr('id'));
            Webapp.CheckedFilters.removeObject(myObject);
        }
    });
}

function bubbleChecks(checkbox, val) {
    checkbox.parents('.js-tree-branch').each(function(){
        if($(this).children('.js-tree-node').children('.js-tree-branch').length > 0) {
            var treeNode = $(this).children('.js-tree-node');
            var allChecked = $(treeNode).children('.js-tree-branch').find("input:checkbox:not(:checked)").length == 0;
            $(this).children('.js-tree-node').children('input:checkbox').prop('checked', allChecked);

            if(allChecked) {
                var myObject = Webapp.CheckedFilters.findProperty('id', $(treeNode).attr('id'));
                if(myObject == undefined) {
                    addNode(treeNode);
                }

                if(allChecked) {
                    // TODO: Remove all children
                    var children = JSON.parse($(treeNode).attr('data-children'));

                    $(children).each(function(){
                        var id = parseInt(this).toString();
                        var myObject = Webapp.CheckedFilters.findProperty('id', id);
                        Ember.set(myObject, 'summaryNode', false);
                    });
                }
            } else {
                var children = JSON.parse($(treeNode).attr('data-children'));
                    
                $(children).each(function(){
                    var id = parseInt(this).toString();
                    var myObject = Webapp.CheckedFilters.findProperty('id', id);
                    if(myObject != undefined)
                        Ember.set(myObject, 'summaryNode', true);
                });

                var myObject = Webapp.CheckedFilters.findProperty('id', $(treeNode).attr('id'));
                Webapp.CheckedFilters.removeObject(myObject);
            }
        }
    });
}

function addNode(treeNode) {
    var id = $(treeNode).attr('id');
    var description = $(treeNode).attr('data-description');
    var parent = $(treeNode).attr('data-parent');
    var children = JSON.parse($(treeNode).attr('data-children'));

    Webapp.CheckedFilters.pushObject({id: id, description: description, children: children, parent: parent, summaryNode: true});
}