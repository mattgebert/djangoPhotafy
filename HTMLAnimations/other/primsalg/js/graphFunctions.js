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
    var gnode; //Groupds labels, nodes and links.
    var label;

    //Stores default Link Color Codes for Links.
    var defaultLinkColors;
    var defaultLinkThickness;

    var initialParams = {
        nodes: null,
        links: null,
        labels: null
    };

    //Vars for Gravity & Charge
    var grav = 0.05;
    var charge = -2000;

    //Vars for SVG Dimensions:
    var w;
    var h;

    this.setup = function(initNumNodes, customLinks, labels) {
        initialParams.nodes = initNumNodes;
        initialParams.links = new LinkSet().clone(customLinks); //Clones linked set, can't be externally modified.
        initialParams.labels = labels;

        //Works out height of Window and adds Container Elements.
        // var width = window.innerWidth,
            // height = window.innerHeight;

        //Intead gives window element height for Photafy management system:
        var width = $('#other_content').css('width').replace(/[^-\d\.]/g, '');
        var height = $('#other_content').css('height').replace(/[^-\d\.]/g, '');

        var functionsBarHeight = height/10;
            height = height * 9 / 10;
        w=width;
        h=height;

        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height);
            // .style("position", "fixed").style("left",0).style("top",0).style("overflow","visible");
        functionBar = container.append("div")
            .style("width", width +'px')
            .style("height", functionsBarHeight+'px')
            // .style("text-align","center")
            // .style("position", "fixed").style("left",0).style("top",height+"px").style("bottom",0).style("right",0).style("overflow","visible");

        //Function Buttons
        btngrp = functionBar.append("div").style('display','table').style('vertical-align','middle').style('height','100%')
                                          .style('margin','0 auto')//.style('width','100%')
                            .append('div').attr("class", "btn-group").style('display','table-cell');
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "backstep").attr("disabled","disabled"));
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "play").attr("disabled","disabled"));
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "step").attr("disabled","disabled"));
        buttons.push(btngrp.append("button").attr("class","btn").attr("id", "reset").attr("disabled","disabled"));
        buttons[0].append("i").attr("class","fa fa-step-backward fa-1x");
        buttons[1].append("i").attr("class","fa fa-play fa-1x");
        buttons[2].append("i").attr("class","fa fa-step-forward fa-1x");
        buttons[3].append("i").attr("class","fa fa-refresh fa-1x");
        btngrp.style("top", (parseInt(functionBar.style("height")) - parseInt(btngrp.style("height")))/2+"px");

        force = d3.layout.force()
            .on("tick", tick)
            .size([w, h])
            .charge(charge)
            .gravity(grav);

        svgBackground = svg.append("rect").attr("width", "100%").attr("height", "100%").attr("x",0).attr("y",0);

        this.subsetup(initNumNodes, new LinkSet().clone(customLinks), labels);
    }

    this.reset = function() {
    //TODO: LOOK AT http://bl.ocks.org/mbostock/1095795 for removing and adding nodes etc.

//        gnode = gnode.splice(1, gnode.length);
//        link = link.splice(1, link.length);
//        node = node.splice(1, node.length));
        //LABELS TOO.
        force.stop();
        link = svg.selectAll(".link").remove();
        node = svg.selectAll(".node").remove();
        gnode = svg.selectAll(".gnode").data([]).exit().remove();

        graph = {
            nodes:[],
            links:[]
        };

        this.subsetup(initialParams.nodes, new LinkSet().clone(initialParams.links), initialParams.labels);
    }

    this.subsetup = function(initNumNodes, customLinks, labels) {

        //Sets up initial nodes:
        graph.nodes = d3.range(initNumNodes).map(function(i,j,k){if (labels == null) {return {"id":i, "label":""};} return {"id":i, "label":labels[j]};});
        graph.links = customLinks;
//        graph.links = customLinks.map(function(i,j,k){
//            return {source:graph.nodes[i.source], target:graph.nodes[i.target]}; //Maps to created graph nodes.
//        });

        force
            .nodes(graph.nodes)
            .links(graph.links)
            .linkDistance(linkD(w,h))
            .start();

        //--Greates SVG Objects for links, labels and nodes--
        //Links:
        link = svg.selectAll(".link")
           .data(graph.links)
         .enter().append("line")
           .attr("class", "link");
        defaultLinkColors = [];
        defaultLinkThickness = [];
        for (var l=0; l < graph.links.length; l++) {
            defaultLinkColors.push("#5aa97b");
            defaultLinkThickness.push(1);
        }

        //Node Groups:
        gnode = svg.selectAll("g.gnode")
            .data(graph.nodes)
            .enter()
            .append('g')
            .classed('gnode', true).call(force.drag); //Makes all nodes dragable.

        //Nodes:
        node = gnode.append("circle").attr("class", "node").attr("r", nodeR(w, h))
            .on("mouseover", function(n) {    //Cursor Functionality: (MouseOver). n is the node number of "this"
                d3.select(this).style("fill", "Aqua");
                for (var l = 0; l < graph.links.length; l++) {
                    if ((graph.links[l].source==n) || (graph.links[l].target==n)){
                        d3.select(link[0][l]).interrupt().style("stroke-width",3*Math.sqrt(defaultLinkThickness[l])).style("stroke", "white");
                    }
                }
            }).on("mouseout", function(n){ //Cursor Functionality: (MouseOut). n is the node number of "this".
                d3.select(this).style("fill", "White");
                for (var l = 0; l < graph.links.length; l++) {
                    if ((graph.links[l].source==n) || (graph.links[l].target==n)){
                        d3.select(link[0][l]).transition().delay(50).style("stroke-width",defaultLinkThickness[l]).style("stroke",defaultLinkColors[l]);
                    }
                }
            });

        //Labels:
        if (labels != "none") {
            label = gnode.append("text")
                .attr("dx", nodeR(w,h)*1.3)
                .attr("dy", ".35em")
                .attr("font-size", 5*Math.sqrt(nodeR(w,h)))
                .attr("fill", "White")
                .text(function(d){return d.label}); //Adds the respective iterate of labels to the given node group.
        }
    }

    //Function that sets link and position locations. Used in the "on()" function.
    function tick(e) {
        var r = nodeR(w,h);
        //Drags node in intended direction & Push Nodes within Boundary:
        link.attr("x1", function(d) { return d.source.x = Math.max(r, Math.min(w-r, d.source.x))})
            .attr("y1", function(d) { return d.source.y = Math.max(r, Math.min(h-r, d.source.y))})
            .attr("x2", function(d) { return d.target.x = Math.max(r, Math.min(w-r, d.target.x))})
            .attr("y2", function(d) { return d.target.y = Math.max(r, Math.min(h-r, d.target.y))});
        gnode.attr("transform", function(d) { return 'translate(' + [d.x = Math.max(r, Math.min(w - r, d.x)), d.y= Math.max(r, Math.min(h - r, d.y))] + ')'; });
    }

    //Specifies a function name for the Window.
    this.name = function(name) {
        container.append("div")
    }

    //Ability to modify default Force of
    this.changeForce = function(charg, gravity){
        //Charge determines how much each node repells other nodes.
        //Gravity determines how much pull there is to the centre of the SVG.
        grav = gravity;
        charge = charg;
        force.charge(charg).gravity(gravity);
    }

    //Function to determine the link distance of nodes.
    function linkD(width, height) {
        return Math.sqrt(width * height/ graph.nodes.length/5);
    }
    //Function to determine the node radius of nodes.
    function nodeR(width, height) {
        return Math.sqrt(width * height / graph.nodes.length) / 40;
    }

    //Determines if two "links" are equivelent.
    function compareLink(link1, link2) {
        return (((link1.target == link2.target && link1.source == link2.source) || (link1.target == link2.source && link2.target == link1.source))  ? true : false);
    }

    //Resize event, bount to window resize.
    function resizeEvent() {
        var width = window.innerWidth, height = window.innerHeight;
        var functionsBarHeight = height/10;
            height = height * 9 / 10;

        w=width; h = height;

        node.attr("r", nodeR(width, height));
        functionBar.attr("width", width).attr("height", functionsBarHeight).style("top",height + "px");
        svg.attr("width", width).attr("height", height);

        label.attr("dx", nodeR(width,height)*1.3)
            .attr("font-size", 5*Math.sqrt(nodeR(width,height)));

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
            if ((graph.links[l].source.id==node1 && graph.links[l].target.id == node2) || (graph.links[l].target.id==node1 && graph.links[l].source.id == node2)) {
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
        for (var l = 0; l < graph.links.length; l++) {
            if (graph.links[l].source.id==node || graph.links[l].target.id == node) {
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

        return links;
    }

    this.worm = function(nodes){
        var links = [];
        for (var v = 1; v<nodes; v++) {
            links.push({source:v,target:(v-1)});
        }
        return links;
    }

    this.clone = function(links) {
        var c = [];
        for (var i = 0; i < links.length; i++) {
            c.push({source:links[i].source, target:links[i].target})
        }
        return c;
    }
}
