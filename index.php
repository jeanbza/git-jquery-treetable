<link rel="stylesheet" type="text/css" href="css/app.css">
<script src="js/jquery/jquery-1.9.1.min.js"></script>
<script src="js/treetable.js"></script>

<?php
    $recursiveDepth = 5;
    $childrenPerParent = 8;
    $items = 0;

    $treeHierarchical = recursivelyCreateHierarchicalTree($recursiveDepth, $childrenPerParent);

    echo "<div>There are ".$items." items in the tree.</div>";

    echo "<div class='js-treetable treetable'>";
    echo "<a class='js-expand-collapse js-collapse'>Collapse All</a>";
    emitTree($treeHierarchical, 0);
    echo "</div>";

    function emitTree($tree, $level) {
        if($level == 0)
            echo "<ul class='js-tree-branch tree-branch root'>";
        else
            echo "<ul class='js-tree-branch tree-branch'>";
        
        // Only root should have the root class. Only leaves should have data attributes
        if($level == 0) {                                       // Root node
            $treeNodeClasses[] = 'root';
            echo "<li id='".$tree['id']."' class='root js-tree-node tree-node'>";
        } else {
            echo "<li id='".$tree['id']."' class='js-tree-node tree-node'>";
        }

        echo "<input class='checkbox' type='checkbox'/>";
        if(count($tree['children']) > 0)
            echo "<a class='js-toggle-expand toggle-expand'>&#x25BC;</a>";
        
        echo $tree['text'];
        if(isset($tree['code']))
            echo "<div class='float-right'>".$tree['code']."</div>";

        foreach($tree['children'] as $child) {
            emitTree($child, $level+1);
        }

        echo "</li>";
        echo "</ul>";
    }

    // Some helper functions to generate data for us

    function getRandomWord() {
        $randomWords = ['Rock', 'Paper', 'Scissor'];
        shuffle($randomWords);
        return $randomWords[0];
    }

    function recursivelyCreateHierarchicalTree($recursiveDepth, $childrenPerParent) {
        $children = array();
        global $items;

        if($recursiveDepth > 0) {
            for($x = 0; $x < $childrenPerParent; $x++) {
                $newChild = recursivelyCreateHierarchicalTree($recursiveDepth-1, $childrenPerParent);
                $children[] = $newChild;
            }
        }

        $items++;
        return array('id' => $items, 'text' => getRandomWord(), 'children' => $children);
    }
?>