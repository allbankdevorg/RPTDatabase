(function($) {
    $.fn.orgChart = function(options) {
        var opts = $.extend({}, $.fn.orgChart.defaults, options);
        return new OrgChart($(this), opts);        
    }

    $.fn.orgChart.defaults = {
        data: [{id:1, name:'Root', parent: 0}],
        showControls: false,
        allowEdit: false,
        onAddNode: null,
        onDeleteNode: null,
        onClickNode: null,
        // newNodeText: 'Add Child'
        newNodeText: ''
    };

    function OrgChart($container, opts){
        var data = opts.data;
        var nodes = {};
        var rootNodes = [];
        this.opts = opts;
        this.$container = $container;
        var self = this;

        this.draw = function(){
            // $container.empty().append(rootNodes[0].render(opts));
            // $container.find('.node').click(function(){
            //     if(self.opts.onClickNode !== null){
            //         self.opts.onClickNode(nodes[$(this).attr('node-id')]);
            //     }
            // });

            $container.empty();
            for (var i = 0; i < rootNodes.length; i++) {
                $container.append(rootNodes[i].render(opts));
            }
            $container.find('.node').click(function(){
                if(self.opts.onClickNode !== null){
                    self.opts.onClickNode(nodes[$(this).attr('node-id')]);
                }
            });

            if(opts.allowEdit){
                $container.find('.node h2').click(function(e){
                    var thisId = $(this).parent().attr('node-id');
                    self.startEdit(thisId);
                    e.stopPropagation();
                });
            }

            // add "add button" listener
            // $container.find('.org-add-button').click(function(e){
            //     var thisId = $(this).parent().attr('node-id');

            //     if(self.opts.onAddNode !== null){
            //         self.opts.onAddNode(nodes[thisId]);
            //     }
            //     else{
            //         self.newNode(thisId);
            //     }
            //     e.stopPropagation();
            // });

            // $container.find('.org-del-button').click(function(e){
            //     var thisId = $(this).parent().attr('node-id');

            //     if(self.opts.onDeleteNode !== null){
            //         self.opts.onDeleteNode(nodes[thisId]);
            //     }
            //     else{
            //         self.deleteNode(thisId);
            //     }
            //     e.stopPropagation();
            // });
        }

        this.startEdit = function(id){
            var inputElement = $('<input class="org-input" type="text" value="'+nodes[id].data.name+'"/>');
            $container.find('div[node-id='+id+'] h2').replaceWith(inputElement);
            var commitChange = function(){
                var h2Element = $('<h2>'+nodes[id].data.name+'</h2>');
                if(opts.allowEdit){
                    h2Element.click(function(){
                        self.startEdit(id);
                    })
                }
                inputElement.replaceWith(h2Element);
            }  
            inputElement.focus();
            inputElement.keyup(function(event){
                if(event.which == 13){
                    commitChange();
                }
                else{
                    nodes[id].data.name = inputElement.val();
                }
            });
            inputElement.blur(function(event){
                commitChange();
            })
        }

        this.newNode = function(parentId){
            var nextId = Object.keys(nodes).length;
            while(nextId in nodes){
                nextId++;
            }

            self.addNode({id: nextId, name: '', parent: parentId});
        }

        this.addNode = function(data){
            var newNode = new Node(data);
            nodes[data.id] = newNode;
            nodes[data.parent].addChild(newNode);

            self.draw();
            self.startEdit(data.id);
        }

        this.deleteNode = function(id){
            for(var i=0;i<nodes[id].children.length;i++){
                self.deleteNode(nodes[id].children[i].data.id);
            }
            nodes[nodes[id].data.parent].removeChild(id);
            delete nodes[id];
            self.draw();
        }

        this.getData = function(){
            var outData = [];
            for(var i in nodes){
                outData.push(nodes[i].data);
            }
            return outData;
        }

        // constructor
        for(var i in data){
            var node = new Node(data[i]);
            nodes[data[i].id] = node;
        }

        // generate parent child tree
        for(var i in nodes){
            if(nodes[i].data.parent == 0 || nodes[i].data.parent == ""){
                rootNodes.push(nodes[i]);
            }
            else{
                nodes[nodes[i].data.parent].addChild(nodes[i]);
            }
        }

        // draw org chart
        $container.addClass('orgChart');
        self.draw();
    }

    function Node(data){
        this.data = data;
        this.children = [];
        var self = this;

        this.addChild = function(childNode){
            this.children.push(childNode);
        }

        this.removeChild = function(id){
            for(var i=0;i<self.children.length;i++){
                if(self.children[i].data.id == id){
                    self.children.splice(i,1);
                    return;
                }
            }
        }

        this.render = function(opts){
            var childLength = self.children.length,
                mainTable;

            mainTable = "<table cellpadding='0' cellspacing='0' border='0'>";
            var nodeColspan = childLength>0?2*childLength:2;
            mainTable += "<tr><td colspan='"+nodeColspan+"'>"+self.formatNode(opts)+"</td></tr>";

            if(childLength > 0){
                var downLineTable = "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";
                mainTable += "<tr class='lines'><td colspan='"+childLength*2+"'>"+downLineTable+'</td></tr>';

                var linesCols = '';
                for(var i=0;i<childLength;i++){
                    if(childLength==1){
                        linesCols += "<td class='line left half'></td>";    // keep vertical lines aligned if there's only 1 child
                    }
                    else if(i==0){
                        linesCols += "<td class='line left'></td>";     // the first cell doesn't have a line in the top
                    }
                    else{
                        linesCols += "<td class='line left top'></td>";
                    }

                    if(childLength==1){
                        linesCols += "<td class='line right half'></td>";
                    }
                    else if(i==childLength-1){
                        linesCols += "<td class='line right'></td>";
                    }
                    else{
                        linesCols += "<td class='line right top'></td>";
                    }
                }
                mainTable += "<tr class='lines v'>"+linesCols+"</tr>";

                mainTable += "<tr>";
                for(var i in self.children){
                    mainTable += "<td colspan='2'>"+self.children[i].render(opts)+"</td>";
                }
                mainTable += "</tr>";
            }
            mainTable += '</table>';
            return mainTable;
        }

        

        this.formatNode = function(opts){
            var nameString = '',
                descString = '';
            if(typeof data.name !== 'undefined'){
                nameString = '<h2>'+self.data.name+'</h2>';
            }
            if(typeof data.description !== 'undefined'){
                descString = '<p>'+self.data.description+'</p>';
            }
            if(opts.showControls){
                var buttonsHtml = "<div class='org-add-button'>"+opts.newNodeText+"</div><div class='org-del-button'></div>";
            }
            else{
                buttonsHtml = '';
            }
            return "<div class='node' node-id='"+this.data.id+"'>"+nameString+descString+buttonsHtml+"</div>";
        }
    }

})(jQuery);

















// (function($) {
//     $.fn.orgChart = function(options) {
//         var opts = $.extend({}, $.fn.orgChart.defaults, options);
//         return new OrgChart($(this), opts);        
//     }

//     $.fn.orgChart.defaults = {
//         data: [{id:1, name:'Root', parent: 0}],
//         showControls: false,
//         allowEdit: false,
//         onAddNode: null,
//         onDeleteNode: null,
//         onClickNode: null,
//         // newNodeText: 'Add Child'
//         newNodeText: ''
//     };

//     function OrgChart($container, opts){
//         var nodes = {}; // Nested structure to store nodes
//         var rootNodes = [];
//         this.opts = opts;
//         this.$container = $container;
//         var self = this;

//         this.draw = function(){
//             $container.empty().append(rootNodes[0].render(opts));
//             $container.find('.node').click(function(){
//                 if(self.opts.onClickNode !== null){
//                     self.opts.onClickNode(nodes[$(this).attr('parent-id')][$(this).attr('node-id')]);
//                 }
//             });

//             if(opts.allowEdit){
//                 $container.find('.node h2').click(function(e){
//                     var thisId = $(this).parent().attr('node-id');
//                     var parentId = $(this).parent().attr('parent-id');
//                     self.startEdit(parentId, thisId);
//                     e.stopPropagation();
//                 });
//             }
//         }

//         this.startEdit = function(parentId, id){
//             var inputElement = $('<input class="org-input" type="text" value="'+nodes[parentId][id].data.name+'"/>');
//             $container.find('div[parent-id='+parentId+'][node-id='+id+'] h2').replaceWith(inputElement);
//             var commitChange = function(){
//                 var h2Element = $('<h2>'+nodes[parentId][id].data.name+'</h2>');
//                 if(opts.allowEdit){
//                     h2Element.click(function(){
//                         self.startEdit(parentId, id);
//                     })
//                 }
//                 inputElement.replaceWith(h2Element);
//             }  
//             inputElement.focus();
//             inputElement.keyup(function(event){
//                 if(event.which == 13){
//                     commitChange();
//                 }
//                 else{
//                     nodes[parentId][id].data.name = inputElement.val();
//                 }
//             });
//             inputElement.blur(function(event){
//                 commitChange();
//             })
//         }

//         this.newNode = function(parentId){
//             var nextId = Object.keys(nodes[parentId]).length;
//             while(nextId in nodes[parentId]){
//                 nextId++;
//             }

//             self.addNode(parentId, {id: nextId, name: '', parent: parentId});
//         }

//         this.addNode = function(parentId, data){
//             var newNode = new Node(data);
//             if (!nodes[parentId]) {
//                 nodes[parentId] = {};
//             }
//             nodes[parentId][data.id] = newNode;
//             nodes[data.parent].addChild(newNode);

//             self.draw();
//             self.startEdit(parentId, data.id);
//         }

//         this.deleteNode = function(parentId, id){
//             for(var i=0;i<nodes[parentId][id].children.length;i++){
//                 self.deleteNode(id, nodes[parentId][id].children[i].data.id);
//             }
//             nodes[nodes[parentId][id].data.parent].removeChild(id);
//             delete nodes[parentId][id];
//             self.draw();
//         }

//         this.getData = function(){
//             var outData = [];
//             for(var parentId in nodes){
//                 for(var nodeId in nodes[parentId]){
//                     outData.push(nodes[parentId][nodeId].data);
//                 }
//             }
//             return outData;
//         }

//         // constructor
//         var data = opts.data;
//         for(var i in data){
//             var node = new Node(data[i]);
//             if (!nodes[data[i].parent]) {
//                 nodes[data[i].parent] = {};
//             }
//             nodes[data[i].parent][data[i].id] = node;
//         }

//         // generate parent child tree
//         for(var parentId in nodes){
//             for(var nodeId in nodes[parentId]){
//                 if(nodes[parentId][nodeId].data.parent == 0){
//                     rootNodes.push(nodes[parentId][nodeId]);
//                 }
//                 else{
//                     nodes[nodes[parentId][nodeId].data.parent].addChild(nodes[parentId][nodeId]);
//                 }
//             }
//         }

//         // draw org chart
//         $container.addClass('orgChart');
//         self.draw();
//     }

//     function Node(data){
//         this.data = data;
//         this.children = [];
//         var self = this;

//         this.addChild = function(childNode){
//             this.children.push(childNode);
//         }

//         this.removeChild = function(id){
//             for(var i=0;i<self.children.length;i++){
//                 if(self.children[i].data.id == id){
//                     self.children.splice(i,1);
//                     return;
//                 }
//             }
//         }

//         this.render = function(opts){
//             var childLength = self.children.length,
//                 mainTable;

//             mainTable = "<table cellpadding='0' cellspacing='0' border='0'>";
//             var nodeColspan = childLength>0?2*childLength:2;
//             mainTable += "<tr><td colspan='"+nodeColspan+"'>"+self.formatNode(opts)+"</td></tr>";

//             if(childLength > 0){
//                 var downLineTable = "<table cellpadding='0' cellspacing='0' border='0'><tr class='lines x'><td class='line left half'></td><td class='line right half'></td></table>";
//                 mainTable += "<tr class='lines'><td colspan='"+childLength*2+"'>"+downLineTable+'</td></tr>';

//                 var linesCols = '';
//                 for(var i=0;i<childLength;i++){
//                     if(childLength==1){
//                         linesCols += "<td class='line left half'></td>";    // keep vertical lines aligned if there's only 1 child
//                     }
//                     else if(i==0){
//                         linesCols += "<td class='line left'></td>";     // the first cell doesn't have a line in the top
//                     }
//                     else{
//                         linesCols += "<td class='line left top'></td>";
//                     }

//                     if(childLength==1){
//                         linesCols += "<td class='line right half'></td>";
//                     }
//                     else if(i==childLength-1){
//                         linesCols += "<td class='line right'></td>";
//                     }
//                     else{
//                         linesCols += "<td class='line right top'></td>";
//                     }
//                 }
//                 mainTable += "<tr class='lines v'>"+linesCols+"</tr>";

//                 mainTable += "<tr>";
//                 for(var i in self.children){
//                     mainTable += "<td colspan='2'>"+self.children[i].render(opts)+"</td>";
//                 }
//                 mainTable += "</tr>";
//             }
//             mainTable += '</table>';
//             return mainTable;
//         }

//         this.formatNode = function(opts){
//             var nameString = '',
//                 descString = '';
//             if(typeof data.name !== 'undefined'){
//                 nameString = '<h2>'+self.data.name+'</h2>';
//             }
//             if(typeof data.description !== 'undefined'){
//                 descString = '<p>'+self.data.description+'</p>';
//             }
//             if(opts.showControls){
//                 var buttonsHtml = "<div class='org-add-button'>"+opts.newNodeText+"</div><div class='org-del-button'></div>";
//             }
//             else{
//                 buttonsHtml = '';
//             }
//             return "<div class='node' parent-id='"+this.data.parent+"' node-id='"+this.data.id+"'>"+nameString+descString+buttonsHtml+"</div>";
//         }
//     }

// })(jQuery);

