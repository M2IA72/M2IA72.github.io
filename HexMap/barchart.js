function MakeBarChart(){
  let ele = document.getElementById("bc"),
      eleStyle = window.getComputedStyle(ele),
      eleWidth = parseInt(eleStyle.width),
      eleHeight= parseInt(eleStyle.height);
  let margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = eleWidth - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;



  var svg2 = d3.select("div.barchart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.1);

  let x1 = d3.scaleBand()
      .padding(0.05);

  let y = d3.scaleLinear()
      .rangeRound([height, 0]);

  let z = d3.scaleOrdinal()
      .range(["#98abc5","#d0743c", "#ff8c00"]);

  d3.csv("data.csv", function(d, i, columns) {
    for (let i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
    return d;
  }, function(error, data) {
    if (error) throw error;

    let keys = data.columns.slice(1);

    x0.domain(data.map(function(d) { return d.Country; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    svg2.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Country) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    svg2.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Average");

    let legend = svg2.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  });
}
MakeBarChart();
