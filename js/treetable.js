$(document).ready(function(){
    refreshTreeBindings();
});

function refreshTreeBindings() {
    // Cascade and bubble checks
    $("body").delegate('.js-treetable input:checkbox', 'change', function() {
        var val = $(this).prop('checked');
        cascadeChecks($(this), val);
        bubbleChecks($(this), val);
    });

    // Toggle Expand/Collapse
    $("body").delegate('.js-toggle-expand', 'click', function(){
        if($(this).parent().hasClass('children-are-invisible')) {
            $(this).html("&#x25BC;");
            $(this).parent().removeClass('children-are-invisible');
        } else {
            $(this).html("&#x25B6;");
            $(this).parent().addClass('children-are-invisible');
        }
    });

    // Expand / Collapse All
    $("body").delegate('.js-expand-collapse', 'click', function(){
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
    $(".tree-node#"+id).parents(".tree-node").removeClass('children-are-invisible').children(".toggle-expand").html("&#x25BC;");
    cascadeChecks($(".tree-node#"+id).children('input:checkbox'), true);
    bubbleChecks($(".tree-node#"+id).children('input:checkbox'), true);
}

function cascadeChecks(checkbox, val) {
    checkbox.parent().find("input:checkbox").each(function() {
        $(this).prop('checked', val);
    });
}

function bubbleChecks(checkbox, val) {
    checkbox.parents('.tree-branch').each(function(){
        if($(this).children('.tree-node').children('.tree-branch').length > 0) {
            var allChecked = $(this).children('.tree-node').children('.tree-branch').find("input:checkbox:not(:checked)").length == 0;
            $(this).children('.tree-node').children('input:checkbox').prop('checked', allChecked);
        }
    });
}