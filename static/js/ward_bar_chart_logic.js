// Select the container element
const chartContainer = d3.select("#chart");

// Retrieve data from the API
fetch("/api/bar_chart_data")
  .then(response => response.json())
  .then(data => {
    // Parse and format the data as needed

    // Create an SVG element
    const svg = chartContainer.append("svg")
      .attr("width", 500) // Set the width of the SVG
      .attr("height", 400); // Set the height of the SVG

    // Set the dimensions and margins
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.Ward))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Count)])
      .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Create a group for the chart
    const chart = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw the bars
    chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.Ward))
      .attr("y", d => yScale(d.Count))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.Count));

    // Add x-axis
    chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // Add y-axis
    chart.append("g")
      .attr("class", "y-axis")
      .call(yAxis);

    // Add labels to the x-axis
    chart.append("text")
      .attr("class", "x-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .text("Ward");

    // Add labels to the y-axis
    chart.append("text")
      .attr("class", "y-label")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 10)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Count");
  })
  .catch(error => {
    // Handle error if unable to fetch data from the API
    console.log("Error:", error);
  });
