git-web-treetable
=================

A fast, extremely lightweight example of how to create an interactive treetable with expand/collapse, expand/collapse all, cascade checking, and bubble checking functionalies.

### How should I format my data to turn into a tree?
This code expects your data to be hierarchical, e.g.:

```
Array (
    [id] => 3
    [text] => Rock
    [children] => Array (
            [0] => Array (
                    [id] => 1
                    [text] => Paper
                    [children] => Array()
                )
            [1] => Array (
                    [id] => 2
                    [text] => Paper
                    [children] => Array()
                )
        )
)
```

### Why is treetable.js using .delegate() instead of .click() or .change()?
Based on tests with huge amounts of data (e.g. a 5x8 - 5 deep with 8 children per parent), there doesn't seem to be much of a difference between the two. Binding with both is slow and execution with both is slow. However, theory (and research) indicates that delegation should save cycles and memory at attachment, whereas .click() will save cycles at execution. 

Since we are more concerned with saving initial load time - due to the fact that most computers won't feel bottlenecks at execution time - we choose delegation over binding each element.