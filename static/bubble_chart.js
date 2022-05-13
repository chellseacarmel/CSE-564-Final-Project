const makeBubbleChart = (title, country, dataset,param,id) => {
    // First sum based on dataset

    var bubbleDataset = {}
    dataset.forEach(d => {
      if (d["country"] == country){
        const pi = d[param].split(/,/) 
        pi.forEach(i => {
          if (i in bubbleDataset){
            bubbleDataset[i] += 1;
          }
          else{
            bubbleDataset[i] = 1;
          }
        })
      }
    });

    delete bubbleDataset[""]
    var bd = Object.entries(bubbleDataset).map((e) => ( { "Name":e[0], "Count":e[1] } ))
    bd = bd.sort((x,y)=>y["Count"]-x["Count"])
    bd = bd.slice(0,10)
    bd = {"children": bd}
    dataset = bd;
    console.log(dataset)
    var diameter = 350;
    var color = d3.scaleOrdinal(d3.schemeCategory20);
  
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);
    
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([10, 0])
        .html(function(d) {
            return "<strong>"+param+": </strong><span class='details'>" + d.data.Name + "<br></span>" + "<strong>Number of Protests: </strong><span class='details'>" + d.data.Count + "</span>";
    })

    // var svg = d3.select("#bubblechart")
    //     .append("svg")
    //     .attr("width", diameter)
    //     .attr("height", diameter)
    //     .attr("class", "bubble");
  
    d3.select(id)
        .append("svg")
        .attr("width", diameter)
        .attr("height", 30)
        .append("text")
        .attr("font-size", "20px")
        .attr("x", 140)
        .attr("y", 25)
        .text(`${title}`)

    var svg = d3.select(id)
        // .attr("class","mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-grid text-aligin--center")
        .append("svg")
        .attr("width", diameter)
        // .attr("height", diameter)
        .attr("height", 350)
        .attr("class", "bubble")
        .attr("transform","translate(40,0)")

    svg.call(tip);
    
    // svg
    // .append("text")
    //     .attr("x", 80)
    //     .attr("y", 20)
    //     .attr("font-size", "20px")
    //     .text(`${title}`)

    var nodes = d3.hierarchy(dataset)
        .sum(function(d) { return d.Count; });
  
    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
  
    node.append("title")
        .text(function(d) {
            return d.Name + ": " + d.Count;
        });
  
    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return color(i);
        });
  
    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            // return d.data.Name.substring(0, d.r / 3);
            return d.data.Name
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");
  
    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.Count;
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");
    
    node.on('mouseover', function(d) {
        tip.show(d);
        d3.select(this)
            .style("stroke-width", 3)
            
    })
  
    .on('mouseout', function(d) {
        tip.hide(d);
        d3.select(this)
            .style("stroke-width", 1)
            
    });
    
  
    // d3.select(self.frameElement)
    //     .style("height", diameter + "px");
  }