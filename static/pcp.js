const buildPCPUser = (dataset, country, startYear, endYear) => {
    console.log(dataset)

    var svg = d3.select("#pcp")
            .attr("class","mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid text-aligin--center")
            .attr("width",1200)
            .attr("height", 600)
            .append("svg")
            .attr("width",1200)
            .attr("height", 600)
  
    dataset = dataset
    .filter(d => d["country"] == country)
    .filter(d => +d["year"] >= +startYear)
    .filter(d => +d["year"] <= +endYear)
    .map(d => {
      return {
        "urbanpop": +d["urbanpop"],
        "gdpgrowth": +d["gdpgrowth"],
        "inflation": +d["inflation"],
        "gdppercap": +d["gdppercap"],
        "salariedEmployment": +d["salariedEmployment"],
        "vulnerableEmployment": +d["vulnerableEmployment"],
        "democracyIndex": +d["democracyIndex"],
        "participants": +d["participants"],
      }
    })

    console.log("lakdfj")
    console.log(dataset)
  
    const margin = 50,
    width = 1200 - margin
    height = 600 - margin

  
    var svg = svg.append("g")
             .attr("transform", "translate(" + -50 + "," + 40 + ")");
    
    dimensions = d3.keys(dataset[0]).filter(function(d) { return d != "clusterID" })
  
    const render = () => {
      var y = {}
      for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
          .domain( d3.extent(dataset, function(d) { return +d[name]; }) )
          .range([height, 0])
      }
    
      x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);
    
      function path(d) {
          return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
      }
  
      svg
        .selectAll("myPath")
        .data(dataset)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "blue")
        .style("opacity", 0.05)
    
      svg.selectAll("myAxis")
        .data(dimensions).enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .text(function(d) { 
            console.log(d)
            switch(d){
              case "urbanpop":
                return "Urban Population (%)"
                break;
              case "gdpgrowth":
                return "GDP Growth (%)"
                break;
              case "inflation":
                return "Inflation (%)"
                break;
              case "gdppercap":
                return "GDP Per Capita (USD)"
                break;
              case "salariedEmployment":
                return "Salaried Employment (%)"
                break;
              case "vulnerableEmployment":
                return "Vulnerable Employment (%)"
                break;
              case "participants":
                return "Participants (people)"
                break;
              case "democracyIndex":
                return "Democracy Index"
                break;
              default:
                return "#000000"
            }
          })
          .style("fill", "black")
          .on("click", d=>{
            dimensions = dimensions.filter((dimension) => dimension !== d);
            dimensions.unshift(d);
            svg.selectAll("*").remove();
            render();
          })
    }
    render()
  }
  