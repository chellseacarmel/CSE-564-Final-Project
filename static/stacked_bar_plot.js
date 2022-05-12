var arr = []


function draw_stacked_bar_plot(violence_data, max_protest_participants, country) {

    console.log("blah")
    console.log(violence_data)
    console.log(max_protest_participants)

    d3.select('#stacked_bar_chart').select('svg').remove()

    const data = Array.from(violence_data.values());
    const years = Array.from(violence_data.keys()).sort();
    const catergories = ['violent',
        'non_violent'];

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 20, left: 80 },
        width = 1600 - margin.left - margin.right,
        height = 90 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#stacked_bar_chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call( d3.brush().extent([[0,0],[1600,90]]).on("end", updateChart) )
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("text")
    //     .attr("text-anchor", "start")
    //     .attr("y", -5)
    //     .attr("x", 0)
    //     .text("V"
    var x = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));


    const color = d3.scaleOrdinal()
        .domain(catergories)
        .range(['#FFB6C1', '#0047AB'])   // '#e41a1c', '#4daf4a'

    const y = d3.scaleLinear()
        .domain([0, max_protest_participants])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(4));

    const stackedData = d3.stack()
        .keys(catergories)
        (data)
    console.log(stackedData)


    var groups =svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) { return color(d.key); })

    var bars= groups.selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.year); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
    
    
    function isBrushed(coords, cx) {
            var x0 = coords[0][0]-110,
                x1 = coords[1][0]-110

            if(x0<= cx && cx <= x1){
                return 1;
            }
           else{
               return 0;
           } 
    }


    function updateChart(){
        arr = []
        bars.attr("rx",function(d){ 
            var temp = isBrushed(d3.event.selection, x(d.data.year))
            if(temp==1){arr.push(d.data.year)}
            return 0})
        console.log(arr)
        d3.select('#bubblechart').select('svg').remove()
        d3.select('#bubblechart2').select('svg').remove()
        d3.select('#bubblechart3').select('svg').remove()
        d3.select('#pcp').select('svg').remove()
        drawCharts()
        drawMap()

    }
}

function getStartTime(){
    return Math.min(...arr)
}


function getEndTime(){
    return Math.max(...arr)
}

