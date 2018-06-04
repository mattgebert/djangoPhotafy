function Graph(containerName) {
    
    var graph = {
        nodes:[],
        links:[]
    };
    
    var svg;
    var svgBackground;
    var functionBar;
    var btngrp;
    var force;
    var container = d3.select(containerName);
    var buttons = [];
    
    //Vars to the SVG Objects.
    var node;
    var link;
    
    //Stores default Link Color Codes for Links.
    var defaultLinkColors;
    var defaultLinkThickness;
    
    var initialParams = {
        nodes: null,
        links: null
    };
    
    
    this.setup = function(initNumNodes, customLinks) {
        
        initialParams.nodes = initNumNodes;
        initialParams.links = customLinks;
        
        //Sets up initial nodes:
        graph.nodes = d3.range(initNumNodes).map(Object);
        graph.links = customLinks;
        
        //Works out height of Window and adds Container Elements.
        var width = window.innerWidth,
            height = window.innerHeight;
        var functionsBarHeight = height/10;
            height = height * 9 / 10;
        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("position", "fixed").style("left",0).style("top",0).style("overflow","visible");
        svgBackground = svg.append("rect").attr("width", "100%").attr("height", "100%").attr("x",0).attr("y",0);
        functionBar = container.append("div")
            .attr("width", width)
            .attr("height", functionsBarHeight)
            .style("position", "fixed").style("left",0).style("top",height+"px").style("bottom",0).style("right",0).style("overflow","visible").style("text-align","center");
        
        //Function Buttons
        btngrp = functionBar.append("div").attr("class", "btn-group");
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "backstep").attr("disabled","disabled"));
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "play").attr("disabled","disabled"));
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "step").attr("disabled","disabled"));
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "reset").attr("disabled","disabled"));
        buttons[0].append("i").attr("class","icon-medium icon-step-backward");
        buttons[1].append("i").attr("class","icon-medium icon-play");
        buttons[2].append("i").attr("class","icon-medium icon-step-forward");
        buttons[3].append("i").attr("class","icon-medium icon-stop");
        btngrp.style("top", (parseInt(functionBar.style("height")) - parseInt(btngrp.style("height")))/2+"px");
        
        //TODO: Attempt to create nice layout, but still show graph links below...
        var possibleLinks = [];
        for (var i = 0; i < initNumNodes; i++){
            for (var j = i+1; j < initNumNodes; j++) {
                possibleLinks.push({source:i,target:j});
            }
        }
                                          
        //Sets up force.
        force = d3.layout.force()
            .nodes(graph.nodes)
//            .links(graph.links) //Used when not having invisible links.
            .links(possibleLinks)
            .size([width, height])
            .charge(-30)
            .gravity(0.1)
            .linkDistance(linkD(width,height))
            .on("tick", tick)
            .start();
        
        
        var v = 0;
        //Function that sets link and position locations. Used in the "on()" function.
        function tick(e) {
            //Drags node in intended direction
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });        
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });   
        }
            
            //Pushes Nodes Apart, couldn't get working...
//            var k = e.alpha * 30; //Pushing Scale
//            graph.nodes.forEach(function(o, i){
//                o.y += i & 1 ? k : -k;
//                o.x += i & 2 ? k : -k;
//            });
        
        //Greates SVG Objects for links and nodes.
        link = svg.selectAll(".link")
//           .data(graph.links) //Used when not having invisible links
            .data(possibleLinks)
         .enter().append("line")
           .attr("class", "link");
        
        defaultLinkColors = [];
        defaultLinkThickness = [];
        //OLD CODE THAT GENERATES EDGES ONLY EXISTING WITHIN THE LINK INPUTS.
//        for (var l=0; l < graph.links.length; l++) {
//            defaultLinkColors.push("#5aa97b");
//            defaultLinkThickness.push(1);
//        }
        
        //Made more general, to have invisible links for force layout.: graph.links.length
        for (var l=0; l < possibleLinks.length; l++) {
            var found = false;
            for (var m=0; m < graph.links.length; m++) {
                if (compareLink(possibleLinks[l], graph.links[m])) {
                    defaultLinkColors.push("#5aa97b");
                    d3.select(link[0][l]).style("stroke", "#5aa97b");
                    defaultLinkThickness.push(1);
                    found = true;
                }
            }
            if (!found) {
                defaultLinkColors.push("#00293e");
                d3.select(link[0][l]).style("stroke", "#00293e").style("stroke-width",0); //#00293e
                defaultLinkThickness.push(0);
            }
        }
//        
        node = svg.selectAll(".node")
            .data(graph.nodes)
            .enter().append("circle").attr("class", "node").attr("r", nodeR(width, height))
            .call(force.drag) //Makes all nodes dragable.
            .on("mouseover", function(n) {    //Cursor Functionality: (MouseOver). n is the node number of "this"
                d3.select(this).style("fill", "Aqua");
                for (var l = 0; l < possibleLinks.length; l++) {
                    //Test if Link is valid link or not:
                    if ((linkIn(possibleLinks[l], graph.links)!= -1) && (possibleLinks[l].source == n || possibleLinks[l].target==n)){
                        d3.select(link[0][l]).interrupt().style("stroke-width",3*Math.sqrt(defaultLinkThickness[l])).style("stroke", "white");
//                        alert(possibleLinks[l].source + " " + possibleLinks[l].target);
                    }
                }
            }).on("mouseout", function(n){ //Cursor Functionality: (MouseOut). n is the node number of "this".
                d3.select(this).style("fill", "White");
                for (var l = 0; l < possibleLinks.length; l++) {
                    if (linkIn(possibleLinks[l], graph.links)!= -1 && (possibleLinks[l].source == n || possibleLinks[l].target==n)){
                            d3.select(link[0][l]).transition().delay(50).style("stroke-width",defaultLinkThickness[l]).style("stroke",defaultLinkColors[l]);
                        }
                }
            });
    }
    
    //Specifies a function name for the Window.
    this.name = function(name) {
        container.append("div")
    }
    
    //Function to determine the link distance of nodes.
    function linkD(width, height) {
        return Math.sqrt(width * height/ graph.nodes.length * 2/3);
    }
    //Function to determine the node radius of nodes.
    function nodeR(width, height) {
        return Math.sqrt(width * height / graph.nodes.length) / 40;
    }
    
    //Determines if two "links" are equivelent.
    function compareLink(link1, link2) {
        return (((link1.target == link2.target && link1.source == link2.source) || (link1.target == link2.source && link2.target == link1.source))  ? true : false);
    }
    
    //Finds if link exists in list and specific index. Returns link index, otherwise -1.
    function linkIn(link, list) {
        for (var i = 0; i < list.length; i++) {
            if (compareLink(link, list[i])) {
                return true;
            }
        }
        return false;
    }
    
    //Resize event, bount to window resize.
    function resizeEvent() {
        var width = window.innerWidth, height = window.innerHeight;
        var functionsBarHeight = height/10;
            height = height * 9 / 10;
        
        node.attr("r", nodeR(width, height));
        functionBar.attr("width", width).attr("height", functionsBarHeight).style("top",height + "px");
        svg.attr("width", width).attr("height", height);
        
        force.stop(); 
        force.size([width, height])
            .linkDistance(linkD(width, height))
            .start();
        
        btngrp.style("top", (parseInt(functionBar.style("height")) - parseInt(btngrp.style("height")))/2+"px");
    }
    
    //EVENT BINDINGS:
    $(window).resize(function() {
        resizeEvent();
    });
    
    
    //Algorithm Functionality:    
    this.highlightNodes = function(nodeNums, color, thickness, transitionDuration) {
        if (thickness == null && color == null) {
            //Do Nothing   
        } else if (color == null) {
            for (var n = 0; n<nodeNums.length; n++) {
                d3.select(node[0][nodeNums[n]]).transition().delay(transitionDuration)
                .style("stroke-width",thickness);
            }
        } else if (thickness == null) {
            for (var n = 0; n<nodeNums.length; n++) {
                d3.select(node[0][nodeNums[n]]).transition().delay(transitionDuration)
                .style("stroke",color);
            }
        } else {
            for (var n = 0; n<nodeNums.length; n++) {
                d3.select(node[0][nodeNums[n]]).transition().delay(transitionDuration)
                .style("stroke",color).style("stroke-width",thickness);
            }
        }
    }
    
    this.highlightEdgeBetweenNodes = function(node1, node2, color, thickness, transitionDuration) {
        for (var l = 0; l < graph.links.length; l++) {
            if ((graph.links[l].source==node1 && graph.links[l].target == node2) || (graph.links[l].target==node1 && graph.links[l].source == node2)) {
//                alert(l + " --- " + graph.links[l].source + "," + graph.links[l].target);
                if (thickness == null && color == null) {
                    //Do Nothing   
                } else if (color == null) {
                    d3.select(link[0][l]).transition().duration(transitionDuration)
                        .style("stroke-width",thickness);
                    defaultLinkThickness[l] = thickness;
                } else if (thickness == null) {
                    d3.select(link[0][l]).transition().duration(transitionDuration)
                    .style("stroke",color);
                    defaultLinkColors[l] = color; //Updates default color.
                } else {
                    d3.select(link[0][l]).transition().duration(transitionDuration)
                    .style("stroke",color).style("stroke-width",thickness);
                    defaultLinkColors[l] = color; //Updates default color.
                    defaultLinkThickness[l] = thickness; //Updates default thickness.
                }    
            }
        }
    }
    
    this.highlightEdge = function(l, color, thickness, transitionDuration) {
        if (thickness == null && color == null) {
            //Do Nothing   
        } else if (color == null) {
            d3.select(link[0][l]).transition().duration(transitionDuration)
                .style("stroke-width",thickness);
            defaultLinkThickness[l] = thickness;
        } else if (thickness == null) {
            d3.select(link[0][l]).transition().duration(transitionDuration)
            .style("stroke",color);
            defaultLinkColors[l] = color; //Updates default color.
        } else {
            d3.select(link[0][l]).transition().duration(transitionDuration)
            .style("stroke",color).style("stroke-width",thickness);
            defaultLinkColors[l] = color; //Updates default color.
            defaultLinkThickness[l] = thickness; //Updates default thickness.
        }    
    }
    
    this.highlightEdgesOfNode = function(node, color, thickness, transitionDuration) {
//        alert(graph.links.length);
        for (var l = 0; l < graph.links.length; l++) {
//            alert("called");
            if (graph.links[l].source==node || graph.links[l].target == node) {
                d3.select(link[0][l]).transition().duration(transitionDuration).style("stroke",color).style("stroke-width", thickness);
                defaultLinkThickness[l] = thickness; //Updates default thickness.
                defaultLinkColors[l] = color; //Updates default color.
            }
        }
    }
    
    this.addNode = function(connectedTo, color) {}
    
    this.bindButton = function(name, func, args) {
        if (name == "backstep") { 
            buttons[0].attr("disabled",null).on('click', function(){func.apply(null, args)});
        } else if (name == "play") { 
            buttons[1].attr("disabled",null).on('click', function(){func.apply(null, args)});
        }  else if (name == "step") { 
            buttons[2].attr("disabled",null).on('click', function(){func.apply(null, args)});
        }  else if (name == "reset") { 
            buttons[3].attr("disabled",null).on('click', function(){func.apply(null, args)});
        } else {
            //ADD BUTTON.
        }
    }
    
    
    this.reset = function() {
    //TODO: LOOK AT http://bl.ocks.org/mbostock/1095795 for removing and adding nodes etc.
//        link = svg.selectAll(".link").remove();
//        node = svg.selectAll(".node").data([]).exit().remove();
//        
//        graph.links = initialParams.links;
//        graph.nodes = d3.range(initialParams.nodes).map(Object);
//        
//        var width = window.innerWidth, height = window.innerHeight*9/10;
//        
        force.stop();        
//        force = d3.layout.force()
//            .nodes(graph.nodes)
//            .links(graph.links)
//            .size([width, height])
//            .charge(-200)
//            .linkDistance(linkD(width,height))
//            .on("tick", tick)
//            .start();
//        
//        link = svg.selectAll(".link")
//           .data(graph.links)
//         .enter().append("line")
//           .attr("class", "link");
//        
//        defaultLinkColors = [];
//        defaultLinkThickness = [];
//        for (var l=0; l < graph.links.length; l++) {
//            defaultLinkColors.push("#5aa97b");
//            defaultLinkThickness.push(1);
//        }
//        
//        node = svg.selectAll(".node")
//            .data(graph.nodes)
//            .enter().append("circle").attr("class", "node").attr("r", nodeR(width, height))
//            .call(force.drag) //Makes all nodes dragable.
//            .on("mouseover", function(n) {    //Cursor Functionality: (MouseOver). n is the node number of "this"
//                d3.select(this).style("fill", "Aqua");
//                for (var l = 0; l < graph.links.length; l++) {
//                    if ((graph.links[l].source==n) || (graph.links[l].target==n)){
//                        d3.select(link[0][l]).interrupt().style("stroke-width",3*Math.sqrt(defaultLinkThickness[l])).style("stroke", "white");
//                    }
//                }
//            }).on("mouseout", function(n){ //Cursor Functionality: (MouseOut). n is the node number of "this".
//                d3.select(this).style("fill", "White");
//                for (var l = 0; l < graph.links.length; l++) {
//                    if ((graph.links[l].source==n) || (graph.links[l].target==n)){
//                        d3.select(link[0][l]).transition().delay(50).style("stroke-width",defaultLinkThickness[l]).style("stroke",defaultLinkColors[l]);
//                    }
//                }
//            });
    }
    
}

function LinkSet() {
    /*Purpose of this class is to be able to define general shapes for easy use in a Graph.
    All methods will return an object set of links. Not designed for weighted graphs. */
    
    this.square = function() {
        //Creates a linked set of 4 Nodes.
        var links = [
            {source:0,target:1},
            {source:1,target:2},
            {source:2,target:3},
            {source:3,target:0}
        ];
        return links;
    }
    
    this.triangle = function() {
        //Creates a linked set of 3 nodes.
        var links = [
            {source:0,target:1},
            {source:1,target:2},
            {source:2,target:0}
        ];
        return links;
    }
    
    this.polygonSet = function(vertexes) {
        //Creates a linked polygon with a specified amount of verticies.
        
        var links = [];
        var v;
        for (v = 0; v<vertexes; v++) {
               links.push({source:v,target:(v+1)});
        }
        links[vertexes-1].target=0;
        return links;
    }
    
    this.polygonBasedSet = function (vertexes, density) {
        //Creates a linked polygon with a specified amount of verticies.
        //Density specifies what percentage of links exists between non-ajacent nodes.
        //Density should be specified between the range of 0 and 1, otherwise treated as 1, that is every
        
        if (density < 0) {denstiy = -denstiy;}
        if (density > 1) {density = 1;}
        
        var links = []
        
        for (var n = 1; n<vertexes; n++) {
            //Connection To Prior Node is Garanteed.
            links.push({source:n,target:n-1});
            
            //Other Connections Based on Density. Does not do any 0th node connections.
            for (var m = n-2; m > 0; m--) {
                if (Math.random() > 1-density) {
                    links.push({source:n,target:m});
                }
            }
        }
        
        //For 0th Node:
        links.push({source:vertexes-1,target:0}); //Round Connection From 0 to Last
        for (var m=vertexes-2; m>1; m--) {
            if (Math.random() > 1-density) {
                links.push({source:m,target:0});
            }
        }
        
//        var str = "";
//        for (var l = 0; l<links.length; l++) {
//            str = str.concat(""+links[l].source + " " + links[l].target + "\n");
//        }
//        alert(str);
        
        return links;
    }
    
    this.worm = function(nodes){
        var links = [];
        for (var v = 1; v<nodes; v++) {
            links.push({source:v,target:(v-1)});
        }
        return links;
    }
    
}