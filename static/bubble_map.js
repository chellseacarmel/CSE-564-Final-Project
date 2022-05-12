

var selected_country="";

function geomap(frequencies){

d3.select('#bubble_map').select('svg').remove()

var width = 900
var height = 500

var projection = d3.geoMercator().translate([ width/2, height/2 ])

selected_country = ""


let onClick = function(d) {
  console.log(d.properties.name)
  selected_country = d.properties.name
  d3.selectAll(".Country")
  .transition()
  .duration(200)
  .style("fill-opacity", 1)
  d3.select(this)
  .transition()
  .duration(2)
  .style("fill-opacity", 1)
  .style("stroke", "#7967ff")
  d3.select('#bubblechart').select('svg').remove()
  d3.select('#bubblechart2').select('svg').remove()
  d3.select('#bubblechart3').select('svg').remove()
  d3.select('#pcp').select('svg').remove()
  drawCharts()
}

const values = Object.values(frequencies);

var colorScale = d3.scaleLinear().domain([Math.min(...values),Math.max(...values)*0.4])
  .range(['#FFB6C1', '#00008B']) // pink,blue

var format = d3.format(",");

var svg = d3.select("#bubble_map")
  .attr("class","mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid text-aligin--center")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

// Need to add the bubbles once we get the data

var g = svg.append("g")
 
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([10, 0])
  .html(function(d) {
      return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Number of Protests: </strong><span class='details'>" + format(frequencies[d.properties.name]) + "</span>";
  })

  svg.call(tip);

    g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("fill", function (d,i) {
        //console.log(frequencies[d.properties.name])

        if(frequencies[d.properties.name]>=0){
          d.total= frequencies[d.properties.name]
          //console.log(d.properties.name,frequencies[d.properties.name])
          return colorScale(d.total)
        }
        else{
          d.total = 0;
          return "#ffffff"
        }
        
      })

    .attr("d", d3.geoPath()
          .projection(projection)
      )
    .style("stroke", "#7967ff")
    .style("opacity",0.3)
    .attr("class", function(d){ return "Country" } )
    .style("opacity", .8)
    .on("click", onClick)

    .on('mouseover', function(d) {
      tip.show(d);
      d3.select(this)
          .style("stroke-width", 3)
          .style("stroke","#ff5252"); //#ff5252   #FFAA33
  })

  .on('mouseout', function(d) {
      tip.hide(d);
      d3.select(this)
          .style("stroke-width", 1)
          .style("stroke","#7967ff");
  });
    
})

var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function() {
          g.selectAll('path')
           .attr('transform', d3.event.transform);
});

svg.call(zoom);
}

function getSelectedCountry(){
  return selected_country;
}