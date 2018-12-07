function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  var bmeta = d3.json('/metadata/' + sample);


  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  var panel = d3.select("#sample-metadata");
  panel.html('');

  var tbl = panel.append('table').append('tbody');
  bmeta.then((kv) => {
    Object.keys(kv).forEach(function (key) {
      var val = kv[key];
      console.log(key + '-' + val);
      var row = tbl.append('tr')
      row.html(`<td>${key}</td>
      <td>:</td>
      <td>${val}</td>`)
    })
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var bucharts = d3.json('/samples/' + sample);
  console.log("bucharts: " + bucharts)

  var sameta = d3.select("#pie");
  sameta.html('');


  // // @TODO: Build a Pie Chart

  var pdata = [];
  d3.json('/samples/' + sample).then((sampleNames) => {



    var pi = {
  
      lables: sampleNames.otu_ids.slice(0,10),
      hover: sampleNames.otu_labels.slice(0,10),
      values: sampleNames.sample_values.slice(0,10),
      type: "pie",

    };
    // var dict = {}
    // for (i = 0; i < sampleNames.sample_values.length; i++) {
    //   dict[sampleNames.otu_ids[i]] = sampleNames.sample_values[i];
    // };
    
    // dict.sort(function (first, second) {
    //   return second[1]   - first[1];
    // });
    // console.log(dict);

    pdata.push(pi);


    var layout = {
      title: "Belly Button Pi Chart",
    };

    Plotly.newPlot("pie", pdata, layout);

  });


  // @TODO: Build a Bubble Chart using the sample data
  // Create the data array for the plot
  var data = []
  d3.json('/samples/' + sample).then((sampleNames) => {


    var bubbcharts = {

      x: sampleNames['otu_ids'],
      y: sampleNames['sample_values'],
      mode: "markers",
      type: "bubble",
      name: sampleNames['otu_labels'],
      marker: {
        color: sampleNames['otu_ids'],
        symbol: "circle",
        size: sampleNames['sample_values']

      }

    }
    data.push(bubbcharts);

    var layout = {
      title: "Belly Button Bubble Chart",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };


    // Plot the chart to a div tag with id "plot"
    Plotly.newPlot("bubble", data, layout);

  });
  // Define the plot layout



  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });


    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();