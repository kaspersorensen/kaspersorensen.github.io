(function (d3) {
	'use strict';

	const chartDiv = document.getElementById("chart");
	const svg = d3.select(chartDiv).append("svg");

	// PLOT AREA
	const margin = {
		top: 20,
		right: 20,
		bottom: 80,
		left: 20
	};
	const g = svg.append('g');
	const xAxisG = g.append('g');
	const yAxisG = g.append('g');

	const toDate = d => {
		if (d == "TODAY()") {
			return new Date();
		}
		return new Date(d);
	}
	const valueFrom = d => d.from;
	const valueTo = d => d.to;

	const render = data => {
		// calculate sizes based of window size and margins
		const width = chartDiv.clientWidth;
		const height = chartDiv.clientHeight;
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		console.log("Width: " + width + ", Height: " + height);
		svg.attr("width", width).attr("height", height);
		g.attr('transform', `translate(${margin.left},${margin.top})`);

		const xMin = d3.min(data.map(valueFrom));
		const xMax = d3.max(data.map(valueTo));

		// X axis
		const xScale = d3.scaleTime()
			.domain([xMin, xMax])
			.range([0, innerWidth]);

		const xAxis = d3.axisBottom(xScale);
		xAxisG.call(xAxis)
			.attr('transform', `translate(0,${innerHeight})`);
		xAxisG.selectAll('.domain').remove();

		// Y axis
		const yScale = d3.scaleBand()
			.domain(["Teaching", "EarlyYears", "School", "DataCleaner", "Seattle"]) // TODO: Make dynamic
			.range([0, innerHeight]);

		// Plot
		var transition = d3.transition().duration(1000);
		var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

		var scatter = g.selectAll('circle').data(data);
		scatter
			.enter().append('circle')
			.merge(scatter)
			.attr('cy', d => yScale(d.swimlane))
			.attr('cx', d => xScale(valueFrom(d)))
			.attr('fill', d => colorScale(d.swimlane))
			.attr('fill-opacity', 0.7)
			.attr('r', 1)
			.transition(transition)
			.attr('r', 10);
	};

	var dataPromise = d3.tsv("/assets/data/career.tsv", row => {
		var from = toDate(row["from_date"]);
		var to = toDate(row["to_date"]);
		var o = {
			from: from,
			to: to,
			swimlane: row["swimlane"],
			company: row["company"],
			title: row["title"],
		};
		return o;
	});
	dataPromise.then(data => {
		render(data);
		window.addEventListener("resize", function () {
			render(data);
		});
	});
}(d3));