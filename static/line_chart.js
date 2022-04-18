

function draw_line_chart(data){

    d3.select('#line_chart').select('svg').remove()
    d3.select('#line_chart').select('svg').remove()
    d3.select('#line_chart').select('svg').remove()
    d3.select('#line_chart').select('svg').remove()

    for(let a =0; a<4;a++){
    var margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 210 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;

    console.log(data.unemploment)

    var svg = d3.select("#line_chart")
    .attr("class","mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-grid text-aligin--center")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, width ]);
  
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

    console.log(d3.max(data[0]))

    //Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { 
        if(a==0){ return +d.gdp}
        else if(a==1){ return +d.inflation}
        else if (a==2){ return +d.urbanization}
        else if(a==3){return +d.unemployment}
    })])
    .range([ height, 0 ]);

    svg.append("g")
    .call(d3.axisLeft(y));

    var color =['#e41a1c','#377eb8','#4daf4a','#ffff33']

    svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", function(d,i){ return color[a] })
       .attr("stroke-width", 1.9)
       .attr("d", d3.line()
          .x(function(d,i) { return x(d.date); })
          .y(function(d,i) { 
            if(a==0){ return y(d.gdp)}
            else if(a==1){ return y(d.inflation)}
            else if (a==2){ return y(d.urbanization)}
            else if(a==3){return y(d.unemployment)}
        })
      )

  // Add titles
  var titles = ["GDP","Inflation","Urbanization","Unemployment"]
  svg.append("text")
  .attr("text-anchor", "start")
  .attr("y", -5)
  .attr("x", 0)
  .text(function(d,i){ return(titles[a])})

}

    

}
