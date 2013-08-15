<html>
    <head>
        <link rel="stylesheet" type="text/css" href="css/app.css">
        <script type="text/javascript" src="js/lib/jquery/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="js/lib/ember/handlebars-1.0.0-rc.4.js"></script>
        <script type="text/javascript" src="js/lib/ember/ember-1.0.0-rc.6.js"></script>
        <script type="text/javascript" src="js/lib/ember/ember-data-latest.min.js"></script>
        <script type="text/javascript" src="js/app.js"></script>
        <script type="text/javascript" src="js/treetable.js"></script>

        <script type="text/javascript">
            $(document).ready(function(){
                refreshTreeBindings();
            });
        </script>
    </head>
    <body>
        <?php
            $recursiveDepth = 2;
            $childrenPerParent = 2;
            $items = 0;

            $treeHierarchical = recursivelyCreateHierarchicalTree($recursiveDepth, $childrenPerParent);

            echo "<div>There are ".$items." items in the tree.</div>";
            echo "<div class='js-treetable treetable'>";
            echo "<div><a class='js-reveal-random-node' data-max-items='".$items."'>Reveal some random node</a></div>";
            echo "<div><a class='js-expand-collapse js-collapse'>Collapse All</a></div>";
            emitTree($treeHierarchical, 0);
            echo "</div>";

            function emitTree($tree, $level, $parent = -1) {
                if($level == 0)
                    echo "<ul class='js-tree-branch tree-branch root'>";
                else
                    echo "<ul class='js-tree-branch tree-branch'>";
                
                $childrenFlat = array();
                foreach($tree['children'] as $child) {
                    $childrenFlat[] = $child['id'];
                }
                $childrenFlat = json_encode($childrenFlat);

                // Only root should have the root class. Only leaves should have data attributes
                if($level == 0) {                                       // Root node
                    $treeNodeClasses[] = 'root';
                    echo "<li id='".$tree['id']."' class='root js-tree-node tree-node' data-description='".$tree['text']."' data-children='".$childrenFlat."'>";
                } else {
                    echo "<li id='".$tree['id']."' class='js-tree-node tree-node' data-description='".$tree['text']."' data-children='".$childrenFlat."' data-parent='".$parent."''>";
                }

                echo "<input class='checkbox' type='checkbox'/>";
                if(count($tree['children']) > 0)
                    echo "<a class='js-toggle-expand toggle-expand'>&#x25BC;</a>";
                
                echo $tree['id'].": ".$tree['text'];

                foreach($tree['children'] as $child) {
                    emitTree($child, $level+1, $tree['id']);
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
    </body>
</html>

<script type="text/x-handlebars">
    Summarized:
    <br>
    {{#each item in Webapp.CheckedFilters}}
        {{#if item.summaryNode}}
            {{item.id}}: {{item.description}}<br>
        {{/if}}
    {{/each}}
    <br>
    Raw:
    <br>
    {{#each item in Webapp.CheckedFilters}}
       {{item.id}}: {{item.description}}<br>
    {{/each}}
</script>