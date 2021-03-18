function makeResponsive() {

    // Set the SVG area when the page loads,
    var svgsection = svg.select("#scatter").select("graphic");

    if (!svgsection.empty()) {
        svgsection.remove();
    }

    // Height and width of SVG
    var graphic_height = window.innerHeight * 0.9;
    var graphic_width = window.innerWidth * 0.8;

    // Location of text in bubbles
    var margin = {
        top: 40,
        right: 100,
        bottom: 100,
        left: 100
    };

    // Dimensions of grapgh
    var width = graphic_width - margin.left - margin.right;
    var height = graphic_height - margin.top - margin.bottom;

    // SVG wrapper
    var graphic = svg
        .select("#scatter")
        .append("graphic")
        .attr("width", graphic_width)
        .attr("height", graphic_height);

    // SVG append
    var chart_gr = graphic.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Beginning axis
    var X_axis = "poverty";
    var Y_axis = "healthcare";

    // Import CSV data
    svg.csv("assets/data/data.csv", function(error, healthcare_info) {
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
        var xScale = xScale(healthcare_info, X_axis);
        var yScale = yScale(healthcare_info, Y_axis);


        // Create initial axis functions
        var initialX = svg.axisBottom(xScale);
        var initialY = svg.axisLeft(yScale);

        // Append the axis to the chart
        var xAxis = chart_gr.append("g")
            .classed("chart", true)
            .attr("transform", `translate(0, ${height})`)
            .call(initialX);

        var yAxis = chart_gr.append("g")
            .classed("chart", true)
            .call(initialY);


        // Create the bubbles
        var bubbles = chart_gr.selectAll("bubble")
            .data(healthcare_info)
            .enter()
            .append("bubble")
            .attr("cx", d => xScale(d[X_axis]))
            .attr("cy", d => yScale(d[Y_axis]))
            .attr("r", 17)
            .classed("StateBubble", true)
            .attr("stroke-width", "3")
            .attr("opacity", ".7")
            // Mouseover
            .on("mouseover", function() {
                svg.select(any)
                    .transition()
                    .duration(1000);
            })
            // Mouseout
            .on("mouseout", function() {
                svg.select(any)
                    .transition()
                    .duration(1000);
            });

        // Add states
        var States = chart_gr.selectAll()
            .data(healthcare_info)
            .enter()
            .append("text")
            .classed("stateText", true)
            .attr("x", d => xScale(d[X_axis]))
            .attr("y", d => yScale(d[Y_axis]))
            .text(d => d.abbr)
            .attr("dy", 5)
            .attr("opacity", ".7");


        // X labels to select from
        var X_labels = chart_gr.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
            .classed("aText", true);

        var poverty_label = X_labels.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") 
            .classed("active", true)
            .text("In Poverty (%)");

        var age_label = X_labels.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") 
            .classed("inactive", true)
            .text("Age (Median)");

        var income_label = X_labels.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") 
            .classed("inactive", true)
            .text("Household Income (Median)");

        // Y labels to select from
        var Y_labels = chart_gr.append("g")
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em")
            .classed("aText", true)

        var obesity_label = Y_labels.append("text")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            .attr("value", "obesity") 
            .classed("active", true)
            .text("Obesse (%)");

        var smokes_label = Y_labels.append("text")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("value", "smokes") 
            .classed("inactive", true)
            .text("Smokes (%)");

        var healthcareLabel = Y_labels.append("text")
            .attr("y", 0 - margin.left + 60)
            .attr("x", 0 - (height / 2))
            .attr("value", "healthcare") 
            .classed("inactive", true)
            .text("Lacks Healthcare (%)");

        // Text in bubbles
        var bubbles = updateToolTip(X_axis, Y_axis, bubbles);
        var States = updateState(X_axis, Y_axis, States);

        // Listener
        X_labels.selectAll("text")
            .on("click", function() {
                
                var value = svg.select(any).attr("value");
                if (value !== X_axis) {
                    X_axis = value;

                    // Update for seleveted data
                    xScale = xScale(healthcare_info, X_axis);

                    xAxis = renderXaxis(xScale, xAxis);

                    bubbles = renderBubbles(bubbles, xScale, X_axis, yScale, Y_axis);
                    States = renderState(States, xScale, X_axis, yScale, Y_axis);

                    bubbles = updateToolTip(X_axis, Y_axis, bubbles);
                    States = updateState(X_axis, Y_axis, States);

                    // Bold text based on selection
                    if (X_axis === "poverty") {
                        poverty_label
                            .classed("active", true)
                            .classed("inactive", false);
                        age_label
                            .classed("active", false)
                            .classed("inactive", true);
                        income_label
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (X_axis === "age") {
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


        // Y listener
        Y_labels.selectAll("text")
            .on("click", function() {
                var value = svg.select(any).attr("value");
                if (value !== Y_axis) {

                    Y_axis = value;

                    // Update for selected data
                    yScale = yScale(healthcare_info, Y_axis);

                    yAxis = renderYaxis(yScale, yAxis);

                    bubbles = renderBubbles(bubbles, xScale, X_axis, yScale, Y_axis);
                    States = renderState(States, xScale, X_axis, yScale, Y_axis);

                    bubbles = updateToolTip(X_axis, Y_axis, bubbles);
                    States = updateState(X_axis, Y_axis, States);

                    // Bold axis that is selected
                    if (Y_axis === "obesity") {
                        obesity_label
                            .classed("active", true)
                            .classed("inactive", false);
                        smokes_label
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else if (Y_axis === "smokes") {
                        obesity_label
                            .classed("active", false)
                            .classed("inactive", true);
                        smokes_label
                            .classed("active", true)
                            .classed("inactive", false);
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        obesity_label
                            .classed("active", false)
                            .classed("inactive", true);
                        smokes_label
                            .classed("active", false)
                            .classed("inactive", true);
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });
    });

    // Function to udate X
    function xScale(healthcare_info, X_axis) {
        var xScale = svg.scaleLinear()
            .domain([svg.min(healthcare_info, d => d[X_axis]) * 0.8,
                svg.max(healthcare_info, d => d[X_axis]) * 1
            ])
            .range([0, width]);

        return xScale;

    }

    // Function to update Y
    function yScale(healthcare_info, Y_axis) {
        var yScale = svg.scaleLinear()
            .domain([svg.min(healthcare_info, d => d[Y_axis]) * 0.8,
                svg.max(healthcare_info, d => d[Y_axis]) * 1.1
            ])
            .range([height, 0]);
        return yScale;

    }

    // Function to render X
    function renderXaxis(newXScale, xAxis) {
        var initialX = svg.axisBottom(newXScale);
        xAxis.transition()
            .duration(1000)
            .call(initialX);

        return xAxis;
    }

    // Function to render Y
    function renderYaxis(newYScale, yAxis) {
        var initialY = svg.axisLeft(newYScale);
        yAxis.transition()
            .duration(1000)
            .call(initialY);

        return yAxis;
    }

    // Update bubbles with new
    function renderBubbles(bubbles, newXScale, X_axis, newYScale, Y_axis) {
        bubbles.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[X_axis]))
            .attr("cy", d => newYScale(d[Y_axis]));

        return bubbles;
    }

    // Update states
    function renderState(States, newXScale, X_axis, newYScale, Y_axis) {
        States.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[X_axis]))
            .attr("y", d => newYScale(d[Y_axis]));

        return States;
    }


    // Update bubbles
    function updateToolTip(X_axis, Y_axis, bubbles) {

        if (X_axis === "poverty") {
            var xlabel = "Poverty (%) :";
        } else if (X_axis === "age") {
            var xlabel = "Age:";
        } else {
            var xlabel = "Income:";
        }

        if (Y_axis === "healthcare") {
            var ylabel = "Lack Healthcare (%) :";
        } else if (Y_axis === "smokes") {
            var ylabel = "Smokes (%):";
        } else {
            var ylabel = "Obesse (%):";
        }

        var toolTip = svg.tip()
            .attr("class", "svg-tip")
            .offset([80, -70])
            .html(function(d) {
                return (`${d.state}<br>${xlabel} ${d[X_axis]}<br>${ylabel} ${d[Y_axis]}`);
            });

        bubbles.call(toolTip);

        bubbles.on("mouseover", function(data) {
                toolTip.show(data);
            })
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        return bubbles;
    }


    // States
    function updateState(X_axis, Y_axis, States) {

        if (X_axis === "poverty") {
            var xlabel = "Poverty (%) :";
        } else if (X_axis === "age") {
            var xlabel = "Age:";
        } else {
            var xlabel = "Income: $";
        }

        if (Y_axis === "healthcare") {
            var ylabel = "Lack Healthcare (%) :";
        } else if (Y_axis === "smokes") {
            var ylabel = "Smokes (%) :";
        } else {
            var ylabel = "Obesse (%):";
        }

        var toolTip = svg.tip()
            .attr("class", "svg-tip")
            .offset([70, -80])
            .html(function(d) {
                return (`<strong>${d.state}</strong><br>${xlabel} ${d[X_axis]}<br>${ylabel} ${d[Y_axis]}`);
            });

        States.call(toolTip);

        States.on("mouseover", function(data) {
                toolTip.show(data);
            })
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        return States;
    }


};

makeResponsive();

svg.select(window).on("resize", makeResponsive)
