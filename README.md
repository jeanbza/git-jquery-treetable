git-web-treetable
=================

A fast, extremely lightweight example of how to create an interactive treetable with expand/collapse, expand/collapse all, cascade checking, and bubble checking functionalies.

### How does the data look before turning it into a tree?
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