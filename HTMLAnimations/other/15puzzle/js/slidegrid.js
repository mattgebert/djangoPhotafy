function Slidegrid(containerName) {

    var svg;
    var container = d3.select(containerName);
    var svgBackground;
    var functionBar;
    var btngrp;
    var buttons = [];


    var sliders = []; //Container for current state. Contains set of SVG Group Elements.
    var finalSliders = []; //Container for finish state. Contains set of strings.
    var actionTrack = []; //Stack to track previous moves.
    var initialSliders = []; //Contains inital set of strings.
    var gridRows;
    var gridColumns;

    var squareGrid = true;
    var squareItems = true;
    var cellWidth;
    var cellHeight;
    var offsetWidth;
    var offsetHeight;

    var gDrag = d3.behavior.drag();
    var singlePossibility = false;
    gDrag.on('drag', gDragEvent);
    gDrag.on("dragend", gDragEndEvent);
    gDrag.on("dragstart", gDragStartEvent);


    this.setup = function(rows, columns, insideText) {
    /*  Rows = Amount of Rows in grid. (integer)
        Columns = Amount of Columns in grid. (integer)
        insideText = List of Strings (array). Also number of items (can include nulls) */

        for (var i = 0; i< insideText.length; i++) {
            initialSliders.push(insideText[i]);
        }

        //Works out height of Window and adds Container Elements.
        // var width = window.innerWidth,
            // height = window.innerHeight;
        var width = $('#other_content').css('width').replace(/[^-\d\.]/g, '');
        var height = $('#other_content').css('height').replace(/[^-\d\.]/g, '');
        var functionsBarHeight = height/10;
        height = height * 9 / 10;
        svg = container.append("svg")
            .attr("width", width)
            .attr("height", height);
            // .style("position", "fixed").style("left",0).style("top",0).style("overflow","visible");
        svgBackground = svg.append("rect").attr("width", "100%").attr("height", "100%").attr("x",0).attr("y",0);
        functionBar = container.append("div")
            .style("width", width +'px')
            .style("height", functionsBarHeight+'px')
            // .style("position", "fixed").style("left",0).style("top",height+"px").style("bottom",0).style("right",0).style("overflow","visible").style("text-align","center");

        //Setting up buttons.
        btngrp = functionBar.append("div").style('display','table').style('vertical-align','middle').style('height','100%')
                                          .style('margin','0 auto')//.style('width','100%')
                            .append('div').attr("class", "btn-group").style('display','table-cell');


        btngrp.append("button").attr("class","btn").attr("id","backstep").on("click", function() {
            if (actionTrack.length > 0) { actionTrack.pop().reverseMove(); }
        }).append("i").attr("class","fa fa-step-backward fa-1x");
        btngrp.append("button").attr("class","btn").attr("id","reset").on("click", reset)
        .append("i").attr("class","fa fa-refresh fa-1x");

        btngrp.style("top", (parseInt(functionBar.style("height")) - parseInt(btngrp.style("height")))/2+"px");




        //Calculates buffer for extra pixels, not divisable by width/height.
        cellWidth = Math.floor(width*3/4/columns);
        cellHeight = Math.floor(height*3/4/rows);

        if (squareGrid) {
            if (cellWidth > cellHeight) {
                cellWidth = cellHeight;
            } else {
                cellHeight = cellWidth;
            }
        }

        offsetWidth = width - cellWidth*columns;
        offsetHeight = height - cellHeight*rows;

        //Sets up the grid.
        //TODO Make variable strokewidth.
        for (var r = 0; r <= rows; r++) {
            svg.append("line").attr("class", "HorGrid").attr("stroke-width",1)
            .attr("x1",offsetWidth/2).attr("x2",width-offsetWidth/2).attr("y1",offsetHeight/2 + cellHeight*r).attr("y2",offsetHeight/2 + cellHeight*r);
        }
        for (var c = 0; c <= columns; c++) {
            svg.append("line").attr("class", "VerGrid").attr("stroke-width",1)
            .attr("y1",offsetHeight/2).attr("y2",height-offsetHeight/2).attr("x1",offsetWidth/2 + cellWidth*c).attr("x2",offsetWidth/2 + cellWidth*c);
        }

        //Item Dimensions
        var draggableHeight = cellHeight * 7/8;
        var draggableWidth = cellWidth * 7/8;
        //Offset within Squares:
        var centeringWidth; var centeringHeight;

        //Creates Square Box.
        if (squareItems) {
            if (draggableHeight > draggableWidth) {
                draggableHeight = draggableWidth;
            } else {
                draggableWidth = draggableHeight;
            }
        }
        centeringHeight = (cellHeight - draggableHeight)/2;
        centeringWidth = (cellWidth - draggableHeight)/2;

        //Set up items in grid.
        for (var i = 0; i < insideText.length; i++) {
            var r = Math.floor(i/columns);
            var c = i%columns;

            if (insideText[i] != null) {
                var item = svg.append("g").attr("class","items").attr("data-id",i)
                    .attr("x", (c*cellWidth + offsetWidth/2)).attr("y", (r*cellHeight + offsetHeight/2))
                    .attr("transform", "translate(" + (c*cellWidth + offsetWidth/2) +", "+(r*cellHeight + offsetHeight/2)+")");
                item.append("rect").attr("class", "cell").attr("width",draggableWidth+"px").attr("height",draggableHeight+"px")
                    .attr("x", centeringWidth).attr("y", centeringHeight);
                item.append("text").attr("class", "label").text(insideText[i])
                    .attr("x", 0.5*cellWidth).attr("y", 0.5*cellHeight)
                    .attr("text-anchor","middle");
                sliders[i] = item;
                item.call(gDrag);
            }
        }

        //Sets up the Object Variables to keep track of movement.
        if (sliders.length < rows*columns) {
            for (var i = sliders.length; i<rows*columns; i++) {
                sliders[i] = null;
            }
        }

        gridColumns = columns;
        gridRows = rows;
    }

    function resizeEvent() {
        var width = window.innerWidth,
            height = window.innerHeight;
        var functionsBarHeight = height/10;
        height = height * 9 / 10;

        //Calculates buffer for extra pixels, not divisable by width/height.
        cellWidth = Math.floor(width*3/4/gridColumns);
        cellHeight = Math.floor(height*3/4/gridRows);

        if (squareGrid) {
            if (cellWidth > cellHeight) {
                cellWidth = cellHeight;
            } else {
                cellHeight = cellWidth;
            }
        }
        offsetWidth = width - cellWidth*gridColumns;
        offsetHeight = height - cellHeight*gridRows;

        //Item Dimensions
        var draggableHeight = cellHeight * 7/8;
        var draggableWidth = cellWidth * 7/8;
        //Offset within Squares:
        var centeringWidth; var centeringHeight;

        //Creates Square Box for draggable items.
        if (squareItems) {
            if (draggableHeight > draggableWidth) {
                draggableHeight = draggableWidth;
            } else {
                draggableWidth = draggableHeight;
            }
        }
        centeringHeight = (cellHeight - draggableHeight)/2;
        centeringWidth = (cellWidth - draggableHeight)/2;

        //Updates to CSS Ratios:
        svg.attr("width", width).attr("height", height); //SVG Dimensions
        functionBar.attr("height", functionsBarHeight).attr("width", width).style("top",height+"px"); //Function Bar
        svg.selectAll(".HorGrid").remove();
        svg.selectAll(".VerGrid").remove();
        for (var r = 0; r <= gridRows; r++) {
            svg.append("line").attr("class", "HorGrid").attr("stroke-width",1) //TODO: update strokewidth based on pixel ratio.
            .attr("x1",offsetWidth/2).attr("x2",width-offsetWidth/2).attr("y1",offsetHeight/2 + cellHeight*r).attr("y2",offsetHeight/2 + cellHeight*r);
        }
        for (var c = 0; c <= gridColumns; c++) {
            svg.append("line").attr("class", "VerGrid").attr("stroke-width",1)
            .attr("y1",offsetHeight/2).attr("y2",height-offsetHeight/2).attr("x1",offsetWidth/2 + cellWidth*c).attr("x2",offsetWidth/2 + cellWidth*c);
        }

        d3.selectAll(".label").transition(400).attr("width", draggableWidth).attr("x", 0.5*cellWidth).attr("y", 0.5*cellHeight);
        d3.selectAll(".cell").transition(400).attr("width", draggableWidth).attr("height", draggableHeight).attr("x", centeringWidth).attr("y", centeringHeight);

        for (var i = 0; i<sliders.length; i++) {
            if (sliders[i] != null) {
                var r = Math.floor(i/gridColumns); var c = i%gridColumns;
                sliders[i].transition().duration(400).attr("transform", "translate(" + (c*cellWidth + offsetWidth/2) + "," + (r*cellHeight + offsetHeight/2) + ")"); //Draggable Items
            }
        }

        btngrp.style("top", (parseInt(functionBar.style("height")) - parseInt(btngrp.style("height")))/2+"px");
    }

    this.solvedState = function(state) {
        finalSliders = state;
    }

    function gDragStartEvent() {
        singlePossibility = false;
        var obj = d3.select(this);
        for (var i = 0; i<sliders.length; i++) {
            if (sliders[i] != null && parseInt(obj.attr("data-id")) == parseInt(sliders[i].attr("data-id"))) {
                break; //Leaves i at correct index.
            }
        }

        //Obtains Grid Coords
        var r =  Math.floor(i/gridColumns),
            c = i%gridColumns;

        //Tests if single possibility of movement, or multiple:
        var targetR = (-1);
        var targetC = (-1);
        if (r+1 < gridRows) {
            if (sliders[(r+1)*gridColumns + c] == null) {
                if (targetC == -1) {
                    targetC = c; targetR = r+1;
                }
            }
        }
        if (r-1 >= 0) {
            if (sliders[(r-1)*gridColumns + c] == null) {
                if (targetC == -1) {
                    targetC = c; targetR = r-1;
                } else {
                    targetC = -2; //Multiple options.
                }
            }

        }
        if (c+1 < gridColumns) {
            if (sliders[r*gridColumns + c+1] == null) {
                if (targetC == -1) {
                    targetC = c+1; targetR = r;
                } else {
                    targetC = -2; //Multiple options.
                }
            }
        }
        if (c-1 >= 0) {
            if (sliders[r*gridColumns + c-1] == null) {
                if (targetC == -1) {
                    targetC = c-1; targetR = r;
                } else {
                    targetC = -2; //Multiple options.
                }
            }
        }

        if (targetC == -1 || targetC == -2) { //No possible movement || Multiple Movement.
            //Do Nothing
        } else {
            sliders[targetR*gridColumns + targetC] = obj;
            obj.transition().duration(400).attr("transform", "translate(" + (targetC*cellWidth + offsetWidth/2) + "," + (targetR*cellHeight + offsetHeight/2) + ")"); //Snaps moved item to empty spot in grid.
            obj.attr("x", targetC*cellWidth + offsetWidth/2).attr("y", targetR*cellHeight + offsetHeight/2);
            actionTrack.push(new move(r,c,targetR,targetC));
            sliders[i] = null;
            singlePossibility = true;

            performCorrectStateEval(); //Checks if problem is completed.
        }
    }

    function gDragEvent(d,i) {
        if (!singlePossibility) {
            var obj = d3.select(this);
            var objCoords = obj.attr("transform").slice(10,-1).split(",");
            var objX = parseFloat(objCoords[0]); var objY = parseFloat(objCoords[1]);

            d3.select(this)
                .attr("x", objX + d3.event.dx)
                .attr("y", objY + d3.event.dy)
                .attr("transform","translate(" + (objX + d3.event.dx) + "," + (objY + d3.event.dy) + ")");
        }
    }

    function gDragEndEvent(d,i) {
        if (!singlePossibility) {
            var obj = d3.select(this);

            var xFinal = parseFloat(obj.attr("x")) + cellWidth*7/8/2; //Uses centre of object rather than top left corner
            var yFinal = parseFloat(obj.attr("y")) + cellHeight*7/8/2;

    //        svg.append("rect").attr("x",xFinal).attr("y",yFinal).attr("width", "5px").attr("height", "5px").style("fill","white");

            //Finds Dragged position of Draggable.
            var column = Math.floor((xFinal - offsetWidth/2)/cellWidth);
            var row = Math.floor((yFinal - offsetHeight/2)/cellHeight);

            //Puts outside boundaries linked to closest boxes.
            if (column >= gridColumns) {
                column = gridColumns-1;
            } else if (column < 0) {
                column = 0;
            }
            if (row >= gridRows) {
                row = gridRows - 1;
            } else if (row < 0) {
                row = 0;
            }

            //Finds original Position of Slider
            var r = null, c = null;
            for (var i = 0; i<sliders.length; i++) {
                if (sliders[i] != null) {
                    if (parseInt(obj.attr("data-id")) == parseInt(sliders[i].attr("data-id"))) {
                        r = Math.floor(i/gridColumns); c = i%gridColumns;
                    }
                }
            }

            //Tests if Slider origin is ajasent to selected square. If magnitude is 1, ajacent.
            var ajacent = correctMove(r, c, row, column);

            if  (ajacent == 1) {
                //Tests if Ajacent square is empty.
                if (sliders[row*gridColumns + column] == null) {
                    //Square is unoccupied.
                    sliders[row*gridColumns + column] = obj;
                    sliders[r*gridColumns + c] = null;
                    obj.transition().duration(400).attr("transform", "translate(" + (column*cellWidth + offsetWidth/2) + "," + (row*cellHeight + offsetHeight/2) + ")"); //Snaps moved item to empty spot in grid.
                    obj.attr("x", column*cellWidth + offsetWidth/2).attr("y", row*cellHeight + offsetHeight/2);
                    actionTrack.push(new move(r,c,row,column));

                    performCorrectStateEval(); //Checks if problem is completed.

                } else {
                    //Square is occupied.
                    obj.transition().duration(400).attr("transform", "translate(" + (c*cellWidth + offsetWidth/2) + "," + (r*cellHeight + offsetHeight/2) + ")"); //Returns to original grid location.
                    obj.attr("x", c*cellWidth + offsetWidth/2).attr("y", r*cellHeight + offsetHeight/2);
                }

            } else { //Same square or diagonal/far away square.
                obj.transition().duration(400).attr("transform", "translate(" + (c*cellWidth + offsetWidth/2) + "," + (r*cellHeight + offsetHeight/2) + ")"); //Returns to original grid location.
                obj.attr("x", c*cellWidth + offsetWidth/2).attr("y", r*cellHeight + offsetHeight/2);
            }
        }
    }

    function correctMove(sRow, sCol, fRow, fCol) {
        //Returns 1 if the move is valid.
        //sRow = Initial Row, sCol = Initial Column, fRow = Final row, fCol = final column.
        return (Math.abs(fCol - sCol) + Math.abs(fRow - sRow));
    }



    function performCorrectStateEval() {
        if (finalSliders != null) {
            valid = true;
            for (var i = 0; i<sliders.length; i++) {
                if (sliders[i] != null && sliders[i] != null) {
                    if (sliders[i].text() !== finalSliders[i]) {
                        valid = false;
                    }
                } else if (sliders[i] == null && sliders[i] == null){
                    //Still valid.
                } else {
                    valid = false;
                }
            }
        }

        if (valid) {alert("Completed")};

    }

    function reset() {
        d3.selectAll(".items").remove();
        sliders = [];
        actionTrack = [];

        //Item Dimensions
        var draggableHeight = cellHeight * 7/8;
        var draggableWidth = cellWidth * 7/8;
        //Offset within Squares:
        var centeringWidth; var centeringHeight;

        //Creates Square Box.
        if (squareItems) {
            if (draggableHeight > draggableWidth) {
                draggableHeight = draggableWidth;
            } else {
                draggableWidth = draggableHeight;
            }
        }
        centeringHeight = (cellHeight - draggableHeight)/2;
        centeringWidth = (cellWidth - draggableHeight)/2;

        //Set up items in grid.
        for (var i = 0; i < initialSliders.length; i++) {
            var r = Math.floor(i/gridColumns);
            var c = i%gridColumns;

            if (initialSliders[i] != null) {
                var item = svg.append("g").attr("class","items").attr("data-id",i)
                    .attr("x", (c*cellWidth + offsetWidth/2)).attr("y", (r*cellHeight + offsetHeight/2))
                    .attr("transform", "translate(" + (c*cellWidth + offsetWidth/2) +", "+(r*cellHeight + offsetHeight/2)+")");
                item.append("rect").attr("class", "cell").attr("width",draggableWidth+"px").attr("height",draggableHeight+"px")
                    .attr("x", centeringWidth).attr("y", centeringHeight);
                item.append("text").attr("class", "label").text(initialSliders[i])
                    .attr("x", 0.5*cellWidth).attr("y", 0.5*cellHeight)
                    .attr("text-anchor","middle");
                sliders[i] = item;
                item.call(gDrag);

            }
        }

        //Sets up the Object Variables to keep track of movement.
        if (sliders.length < rows*columns) {
            for (var i = sliders.length; i<rows*columns; i++) {
                sliders[i] = null;
            }
        }
    }


    //Bindings:
    window.onresize = resizeEvent;

    //Object to reverse moves.
    function move(initRow, initCol, finRow, finCol) {
        var ir = initRow, ic = initCol, fr = finRow, fc = finCol;
        var obj1 = sliders[fr*gridColumns + fc];

        this.reverseMove = function() {
            if (sliders[ir*gridColumns + ic] == null) {
                obj1.attr("x", ic*cellWidth + offsetWidth/2).attr("y", ir*cellHeight + offsetHeight/2)
                .transition().duration(400).attr("transform", "translate(" + (ic*cellWidth + offsetWidth/2) + "," + (ir*cellHeight + offsetHeight/2) + ")");
                sliders[ir*gridColumns + ic] = obj1;
                sliders[fr*gridColumns + fc] = null;
            } else {
                var obj2 = sliders[ir*gridColumns + ic];
                obj1.attr("x", ic*cellWidth + offsetWidth/2).attr("y", ir*cellHeight + offsetHeight/2)
                .transition().duration(400).attr("transform", "translate(" + (ic*cellWidth + offsetWidth/2) + "," + (ir*cellHeight + offsetHeight/2) + ")");
                obj2.attr("x", fc*cellWidth + offsetWidth/2).attr("y", fr*cellHeight + offsetHeight/2)
                .transition().duration(400).attr("transform", "translate(" + (fc*cellWidth + offsetWidth/2) + "," + (fr*cellHeight + offsetHeight/2) + ")");
                sliders[ir*gridColumns + ic] = obj1;
                sliders[fr*gridColumns + fc] = obj2;
            }
        }
    }

}
