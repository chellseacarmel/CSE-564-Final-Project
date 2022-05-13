
function drawMap(){
  d3.csv("static/updated.csv", function(data) {
    console.log(data)

    var start = getStartTime();
    var end = getEndTime();

    if(!isFinite(start)){
      //none are selected
      var frequency = {};
   
      for(var i = 0; i < data.length; i++){
      var current = data[i];
      if(!frequency.hasOwnProperty(current.country)) frequency[current.country] = 0;
      frequency[current.country]++;
    }
      console.log(frequency)
  
      geomap(frequency)
  }
  else{

    var new_data = data.filter(function(d){
      return (d.year>=start) && (d.year<=end)
    })

    var frequency = {};
   
    for(var i = 0; i < new_data.length; i++){
    var current = new_data[i];
    if(!frequency.hasOwnProperty(current.country)) frequency[current.country] = 0;
    frequency[current.country]++;
  }
    console.log(frequency)

    geomap(frequency)

  }

})

}

function drawCharts(){

d3.csv("static/updated.csv", function(data) {
    console.log(data)
    var country = getSelectedCountry()
    var start = getStartTime();
    var end = getEndTime();

    var new_data;

    //console.log(start)
    //console.log(isFinite(start))

    if(country=="" && !isFinite(start)){
        //none are selected
    }
    else if(country!="" && !isFinite(start)){
        // only country is selected
        new_data= data.filter(function(d){
          return d.country == country
      })
      start = 1991
      end = 2019
    }
    else if(country=="" && start!=Number.NEGATIVE_INFINITY ){
        // only time is selected
        new_data = data.filter(function(d){
          return (d.year>=start) && (d.year<=end)
      })

    }
    else if(country!="" && start!=Number.NEGATIVE_INFINITY ){
      // both are selected
      var new_data_country = data.filter(function(d){
        return d.country == country
      })
      new_data = new_data_country.filter(function(d){
        return (d.year>=start) && (d.year<=end)
      })
    }

    var filtered_data = new_data.map(function(d) {
        return {
          date: +d.year,  
          gdp: +d.gdpgrowth,
          urbanization: +d.urbanpop,
          inflation: +d.inflation,
          vulnerable: +d.vulnerableEmployment,
          source: d.sources,
          note: d.notes,
          participants: d.participants,
          demand: d.protesterdemands,
          protesterviolence: d.protesterviolence,
          response: d.stateresponses,
          protestergroup: d.protesteridentity,
          country: d.country,
          democracy: d.democracyIndex,
          salaried: d.salariedEmployment,
          gdppercap: d.gdppercap
        }
      });

    console.log(filtered_data)

    draw_line_chart(filtered_data)

    makeBubbleChart("Protester Identity", country, filtered_data,"protestergroup","#bubblechart")
    makeBubbleChart("Protester Demands", country, filtered_data,"demand","#bubblechart2")
    makeBubbleChart("State Response", country, filtered_data,"response","#bubblechart3")

    drawBarChart(data, country)
    buildPCPUser(data,country,start,end)
    //lakdjfldkjf

    var table_data = []
    filtered_data.forEach(function(d, i){
      table_data.push([d.date, d.note, d.source, d.participants, d.protestergroup, d.protesterviolence==1?"Violent":"Non-Violent", d.demand,d.response]);  
    });

    TableSort(
      "#table",
      [{text:"Year", sort: TableSort.alphabet},
      {text:"Description", sort: TableSort.alphabet}, 
      {text:"Sources", sort: TableSort.alphabet},
      {text:"Participants", sort: TableSort.alphabet},
      {text:"Identity", sort: TableSort.alphabet},
      {text:"Violence", sort: TableSort.alphabet},
      {text:"Demands", sort: TableSort.alphabet},
      {text:"Responses", sort: TableSort.alphabet},
      ],
      table_data,
      {height:"600px", width: "1020px"}
      );
    
    // Adding table interactions
    var trows = document.querySelectorAll("tr")
    trows.forEach(d => {
      let cells = d.querySelectorAll("td")
      cells.forEach(c=>{
        c.style.height = "20px"
      })
      d.className="collapsed"
    })
})

}

function drawBarChart(data, country){
  data = data.filter(d=>d.country == country)

  const violence_data = new Map();
    let max_protest_participants = 0;
    data.forEach(function (d) {
      if (!violence_data.has(d.year)) {
        violence_data.set(d.year, {
          year: d.year,
          violent: 0,
          non_violent: 0,
        })
      };

      const toChange = violence_data.get(d.year);
      if (d.participants !== "nan") {
        if (+d.protesterviolence === 1) {
          toChange.violent += parseInt(d.participants);
          max_protest_participants = Math.max(max_protest_participants, toChange.violent);
        }
        if (+d.protesterviolence === 0) {
          toChange.non_violent += parseInt(d.participants);
          max_protest_participants = Math.max(max_protest_participants, toChange.non_violent);
        }
      }

    });
 
  draw_stacked_bar_plot(violence_data, max_protest_participants, country);
  // d3.csv("static/updated.csv", function(data) {

  //   const violence_data = new Map();
  //     let max_protest_participants = 0;
  //     data.forEach(function (d) {
  //       if (!violence_data.has(d.year)) {
  //         violence_data.set(d.year, {
  //           year: d.year,
  //           violent: 0,
  //           non_violent: 0,
  //         })
  //       };
  
  //       const toChange = violence_data.get(d.year);
  //       if (d.participants !== "nan") {
  //         if (+d.protesterviolence === 1) {
  //           toChange.violent += parseInt(d.participants);
  //           max_protest_participants = Math.max(max_protest_participants, toChange.violent);
  //         }
  //         if (+d.protesterviolence === 0) {
  //           toChange.non_violent += parseInt(d.participants);
  //           max_protest_participants = Math.max(max_protest_participants, toChange.non_violent);
  //         }
  //       }
  
  //     });
   
  //   draw_stacked_bar_plot(violence_data, max_protest_participants, country);
  // })
}

// drawMap()

// drawCharts()
// override window zoom scale
window.onload = () => {
  let currentWidth = document.body.offsetWidth;
  let newZoom = (currentWidth * 100) / 2600;
  // console.log("Width: " + currentWidth);
  // console.log("Zoom: " + newZoom);
  document.body.style.zoom = newZoom + "%";
  console.log("Zoom is changed!");

  drawMap();
  drawCharts();
}