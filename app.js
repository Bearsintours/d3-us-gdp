localStorage.getItem("data")
  ? renderChart(JSON.parse(localStorage.getItem("data")))
  : d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
      (data) => {
        localStorage.setItem("data", JSON.stringify(data));
        renderChart(data);
      }
    );

function renderChart(data) {
  const dataset = data["data"];
  const padding = 60;
  const width = dataset.length * 3 + 2 * padding;
  const height = 500;

  const YMin = 0;
  const YMax = d3.max(dataset, (d) => d[1]);
  const Yscale = d3
    .scaleLinear()
    .domain([YMax, YMin])
    .range([padding, height - padding]);

  const XMin = d3.min(dataset, (d) => d[0].split("-")[0]);
  const XMax = d3.max(dataset, (d) => d[0].split("-")[0]);
  const Xscale = d3
    .scaleLinear()
    .domain([XMin, Number(XMax) + 1])
    .range([padding, width - padding]);

  const svg = d3
    .select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

  const tootTip = d3.select("body").append("div").attr("id", "tooltip");

  const toolTipTop = d3.select("#tooltip").append("div").attr("id", "date");

  const toolTipBottom = d3.select("#tooltip").append("div").attr("id", "gdp");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 3 + padding)
    .attr("y", (d) => Yscale(d[1] - padding))
    .attr("width", 3)
    .attr("height", (d) => height - Yscale(d[1]) - padding)
    .attr("fill", "#1768AC")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", function (d) {
      d3.select("#tooltip")
        .style("opacity", 0.8)
        .attr("data-date", d[0])
        .attr("data-gdp", d[1]);
      d3.select("#date").text(formatDate(d[0]));
      d3.select("#gdp").text(formatGDP(d[1]));
    })
    .on("mouseout", () => d3.select("#tooltip").style("opacity", 0))
    .on("mousemove", () =>
      d3
        .select("#tooltip")
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 80 + "px")
    );

  const yAxis = d3.axisLeft(Yscale);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

  const xAxis = d3.axisBottom(Xscale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);
}

function formatGDP(gdp) {
  return (
    gdp.toLocaleString("en-US", { style: "currency", currency: "USD" }) +
    " Billions"
  );
}

function formatDate(date) {
  const year = date.split("-")[0];
  const month = date.split("-")[1];
  let formattedDate = "";
  if (month === "01") {
    formattedDate = year + " Q1";
  } else if (month === "04") {
    formattedDate = year + " Q2";
  } else if (month === "07") {
    formattedDate = year + " Q3";
  } else {
    formattedDate = year + " Q4";
  }
  return formattedDate;
}
