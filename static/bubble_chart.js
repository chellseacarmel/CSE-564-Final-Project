const makeBubbleChart = (title, country, dataset,param,id) => {
    // First sum based on dataset

    var bubbleDataset = {}
    dataset.forEach(d => {
      if (d["country"] == country){
        const pi = d[param].split(/,|;|and/) 
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
    var diameter = 200;
    var color = d3.scaleOrdinal(d3.schemeCategory20);
  
    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);
  
    // var svg = d3.select("#bubblechart")
    //     .append("svg")
    //     .attr("width", diameter)
    //     .attr("height", diameter)
    //     .attr("class", "bubble");
  
    var svg = d3.select(id)
        // .attr("class","mdl-shadow--2dp mdl-cell mdl-cell--2-col mdl-grid text-aligin--center")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");
  
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
        });
  
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
            return d.data.Name.substring(0, d.r / 3);
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
  
    // d3.select(self.frameElement)
    //     .style("height", diameter + "px");
  }