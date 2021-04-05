function makeResponsive() {

    // Set the SVG area when the page loads,
    var svgsection = d3.select("#scatter").select("svg");

    if (svgsection.empty()) {
        svgsection.remove();
    }

    // Dimensions of grapgh
    var graphic_height = window.innerHeight * 0.9;
    var graphic_width = window.innerWidth * 0.8;

    // Location of text in bubbles
    var margin = {
        top: 40,
        right: 100,
        bottom: 100,
        left: 100
    };

    // Calculate the width and height of the graph
    var width = graphic_width - margin.left - margin.right;
    var height = graphic_height - margin.top - margin.bottom;


    // SVG wrapper
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", graphic_width)
        .attr("height", graphic_height);

    // SVG Append
    var chart_gr = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Beginning axis
    var theXaxis = "poverty";
    var theYaxis = "healthcare";

    // Import CSV
    d3.csv("assets/data/data.csv", function(error, healthcare_info) {
        if (error) return console.warn(error);

        healthcare_info.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.income = +data.income;
            data.obesity = +data.obesity;
        });

        // Create scale functions for x and y axis
        var theXscale = xScale(healthcare_info, theXaxis);
        var theYscale = yScale(healthcare_info, theYaxis);


        // Create initial axis functions
        var initialXaxis = d3.axisBottom(theXscale);
        var initialYaxis = d3.axisLeft(theYscale);

        // Append the axis to the chart
        var xAxis = chart_gr.append("g")
            .classed("chart", true)
            .attr("transform", `translate(0, ${height})`)
            .call(initialXaxis);

        var yAxis = chart_gr.append("g")
            .classed("chart", true)
            .call(initialYaxis);


        // Create the bubbles
        var bubblegroup = chart_gr.selectAll("circle")
            .data(healthcare_info)
            .enter()
            .append("circle")
            .attr("cx", d => theXscale(d[theXaxis]))
            .attr("cy", d => theYscale(d[theYaxis]))
            .attr("r", 17)
            .classed("stateCircle", true)
            .attr("stroke-width", "3")
            .attr("opacity", ".8")
            // Mouseover
            .on("mouseover", function() {
                d3.select(this)
                    .transition()
                    .duration(1000);
            })
            // Mouse out
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(1000);
            });


        // Add States
        var state_lables = chart_gr.selectAll()
            .data(healthcare_info)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => theXscale(d[theXaxis]))
            .attr("y", d => theYscale(d[theYaxis]))
            .text(d => d.abbr)
            .attr("dy", 5)
            .attr("opacity", ".8");


        // X labels to select from
        var XlabelsGroup = chart_gr.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
            .classed("aText", true);

        var poverty_label = XlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") 
            .classed("active", true)
            .text("In Poverty (%)");

        var age_label = XlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") 
            .classed("inactive", true)
            .text("Age (Median)");

        var income_label = XlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") 
            .classed("inactive", true)
            .text("Household Income (Median)");

         // Y labels to select from
        var YlabelsGroup = chart_gr.append("g")
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em")
            .classed("aText", true)

        var obesity_label = YlabelsGroup.append("text")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            .attr("value", "obesity") 
            .classed("active", true)
            .text("Obesse (%)");

        var smokes_label = YlabelsGroup.append("text")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("value", "smokes") 
            .classed("inactive", true)
            .text("Smokes (%)");

        var healthcare_label = YlabelsGroup.append("text")
            .attr("y", 0 - margin.left + 60)
            .attr("x", 0 - (height / 2))
            .attr("value", "healthcare") 
            .classed("inactive", true)
            .text("Lacks Healthcare (%)");

        // Text in bubbles
        var bubblegroup = updateToolTip(theXaxis, theYaxis, bubblegroup);
        var state_lables = updateToolText(theXaxis, theYaxis, state_lables);

        // Listener
        XlabelsGroup.selectAll("text")
            .on("click", function() {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== theXaxis) {

                    
                    theXaxis = value;

                    
                    theXscale = xScale(healthcare_info, theXaxis);

                    
                    xAxis = renderXAxes(theXscale, xAxis);

                    
                    bubblegroup = renderCircles(bubblegroup, theXscale, theXaxis, theYscale, theYaxis);
                    state_lables = renderText(state_lables, theXscale, theXaxis, theYscale, theYaxis);

                    
                    bubblegroup = updateToolTip(theXaxis, theYaxis, bubblegroup);
                    state_lables = updateToolText(theXaxis, theYaxis, state_lables);

                    // Bold text based on selection
                    if (theXaxis === "poverty") {
                        poverty_label
                            .classed("active", true)
                            .classed("inactive", false);
                        age_label
                            .classed("active", false)
                            .classed("inactive", true);
                        income_label
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (theXaxis === "age") {
                        poverty_label
                            .classed("active", false)
                            .classed("inactive", true);
                        age_label
                            .classed("active", true)
                            .classed("inactive", false);
                        income_label
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        poverty_label
                            .classed("active", false)
                            .classed("inactive", true);
                        age_label
                            .classed("active", false)
                            .classed("inactive", true);
                        income_label
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });


        // y listener
        YlabelsGroup.selectAll("text")
            .on("click", function() {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== theYaxis) {

                    
                    theYaxis = value;

                    
                    theYscale = yScale(healthcare_info, theYaxis);

                    
                    yAxis = renderYAxes(theYscale, yAxis);

                    // Update for selected data
                    bubblegroup = renderCircles(bubblegroup, theXscale, theXaxis, theYscale, theYaxis);
                    state_lables = renderText(state_lables, theXscale, theXaxis, theYscale, theYaxis);

                    bubblegroup = updateToolTip(theXaxis, theYaxis, bubblegroup);
                    state_lables = updateToolText(theXaxis, theYaxis, state_lables);

                    // Bold axis that is selected
                    if (theYaxis === "obesity") {
                        obesity_label
                            .classed("active", true)
                            .classed("inactive", false);
                        smokes_label
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcare_label
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (theYaxis === "smokes") {
                        obesity_label
                            .classed("active", false)
                            .classed("inactive", true);
                        smokes_label
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcare_label
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        obesity_label
                            .classed("active", false)
                            .classed("inactive", true);
                        smokes_label
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcare_label
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });
    });

    // Function to udate X
    function xScale(healthcare_info, theXaxis) {
        var theXscale = d3.scaleLinear()
            .domain([d3.min(healthcare_info, d => d[theXaxis]) * 0.8,
                d3.max(healthcare_info, d => d[theXaxis]) * 1
            ])
            .range([0, width]);

        return theXscale;

    }


    // Function to update Y
    function yScale(healthcare_info, theYaxis) {
        var theYscale = d3.scaleLinear()
            .domain([d3.min(healthcare_info, d => d[theYaxis]) * 0.8,
                d3.max(healthcare_info, d => d[theYaxis]) * 1.1
            ])
            .range([height, 0]);

        return theYscale;

    }


    // Function to render X
    function renderXAxes(newXScale, xAxis) {
        var initialXaxis = d3.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(initialXaxis);

        return xAxis;
    }


    // Function to render Y
    function renderYAxes(newYScale, yAxis) {
        var initialYaxis = d3.axisLeft(newYScale);
        yAxis.transition()
            .duration(1000)
            .call(initialYaxis);

        return yAxis;
    }


    // Update bubbles with new
    function renderCircles(bubblegroup, newXScale, theXaxis, newYScale, theYaxis) {
        bubblegroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[theXaxis]))
            .attr("cy", d => newYScale(d[theYaxis]));

        return bubblegroup;
    }


    // Update states
    function renderText(state_lables, newXScale, theXaxis, newYScale, theYaxis) {
        state_lables.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[theXaxis]))
            .attr("y", d => newYScale(d[theYaxis]));

        return state_lables;
    }


    // Update bubbles
    function updateToolTip(theXaxis, theYaxis, bubblegroup) {

        if (theXaxis === "poverty") {
            var xlabel = "Poverty (%) :";
        } else if (theXaxis === "age") {
            var xlabel = "Age:";
        } else {
            var xlabel = "Income:";
        }

        if (theYaxis === "healthcare") {
            var ylabel = "Lacks Healthcare (%) :";
        } else if (theYaxis === "smokes") {
            var ylabel = "Smokes (%):";
        } else {
            var ylabel = "Obesse (%):";
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -70])
            .html(function(d) {
                return (`${d.state}<br>${xlabel} ${d[theXaxis]}<br>${ylabel} ${d[theYaxis]}`);
            });

        bubblegroup.call(toolTip);

        bubblegroup.on("mouseover", function(data) {
                toolTip.show(data);
            })
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        return bubblegroup;
    }


    // States
    function updateToolText(theXaxis, theYaxis, state_lables) {

        if (theXaxis === "poverty") {
            var xlabel = "Poverty (%) :";
        } else if (theXaxis === "age") {
            var xlabel = "Age:";
        } else {
            var xlabel = "Income: $";
        }

        if (theYaxis === "healthcare") {
            var ylabel = "Lacks Healthcare (%) :";
        } else if (theYaxis === "smokes") {
            var ylabel = "Smokes (%) :";
        } else {
            var ylabel = "Obesse (%):";
        }

        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([70, -80])
            .html(function(d) {
                return (`<strong>${d.state}</strong><br>${xlabel} ${d[theXaxis]}<br>${ylabel} ${d[theYaxis]}`);
            });

        state_lables.call(toolTip);

        state_lables.on("mouseover", function(data) {
                toolTip.show(data);
            })
        
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        return state_lables;
    }


};

makeResponsive();

d3.select(window).on("resize", makeResponsive);