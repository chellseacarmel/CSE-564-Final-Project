
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
          gdp: +d.gdppercap,
          urbanization: +d.urbanpop,
          inflation: +d.inflation,
          vulnerable: +d.vulnerableEmployment,
          source: d.sources,
          note: d.notes,
          demand: d.protesterdemands,
          response: d.stateresponses,
          identity: d.protesteridentity,
          country: d.country,
          democracy: d.democracyIndex,
          salaried: d.salariedEmployment,
          gdppercap: d.gdppercap
        }
      });

    console.log(filtered_data)

    draw_line_chart(filtered_data)

    makeBubbleChart("bubblechart", country, filtered_data,"identity","#bubblechart")
    makeBubbleChart("bubblechart", country, filtered_data,"demand","#bubblechart2")
    makeBubbleChart("bubblechart", country, filtered_data,"response","#bubblechart3")

    drawBarChart(data, country)
    buildPCPUser(data,country,start,end)
    //lakdjfldkjf

    var table_data = []
    filtered_data.forEach(function(d, i){
      table_data.push([d.note, d.source,d.demand,d.response]);  
    });

    TableSort(
      "#table",
      [{text:"Description", sort: TableSort.alphabet}, 
      {text:"Sources", sort: TableSort.alphabet},
      {text:"Demands", sort: TableSort.alphabet},
      {text:"Responses", sort: TableSort.alphabet}
      ],
      table_data,
      {display:"flex", height:"300px"}
      );
    
    // Adding table interactions
    var trows = document.querySelectorAll("tr")
    trows.forEach(d => d.id="collapsed")
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

drawMap()

drawCharts()