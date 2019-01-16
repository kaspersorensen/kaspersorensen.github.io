(function (d3) {
	'use strict';

	const chartDiv = document.getElementById("chart");
	const svg = d3.select(chartDiv).append("svg");

	// Prep the tooltip bits, initial display is hidden
	var tooltip = d3.select("body").append("div")
		.attr("class", "timeline_tooltip")
		.style("opacity", 0);

	function tooltipShow() {
		var text = this.dataset.tooltip;

		tooltip.transition()
			.duration(200)
			.style("opacity", 1);
		tooltip.html(text)
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
	}

	function tooltipHide() {
		tooltip.transition()
			.duration(500)
			.style("opacity", 0);
	}

	// PLOT AREA
	const margin = {
		top: 10,
		right: 30,
		bottom: 30,
		left: 30
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
	const tooltipText = d => "<h3>" + d.title + "</h3>" + d.company + "<br>" + d.location;

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
			.range([0, innerWidth])
			.nice();

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
		var radiusScale = d => 2 * d;

		const circlePlot = false;
		if (circlePlot) {
			var circleScatter = g.selectAll('circle').data(data);
			circleScatter
				.enter().append('circle')
				.merge(circleScatter)
				.attr('cy', d => yScale(d.swimlane))
				.attr('cx', d => xScale(valueFrom(d)))
				.attr('fill', d => colorScale(d.swimlane))
				.attr('fill-opacity', 0.7)
				.attr('r', 1)
				.attr("data-tooltip", tooltipText)
				.on("mouseover", tooltipShow)
				.on("mouseout", tooltipHide)
				.transition(transition)
				.attr('r', d => radiusScale(d.score));
		} else {
			var rectScatter = g.selectAll('rect').data(data);
			rectScatter
				.enter().append('rect')
				.merge(rectScatter)
				.attr('y', d => yScale(d.swimlane) + 1.5 * d.score)
				.attr('height', d => 5 * d.score)
				.attr('x', d => xScale(valueFrom(d)))
				.attr('width', d => 1)
				.attr('fill', d => colorScale(d.swimlane))
				.attr('fill-opacity', d => d.score / 10.0)
				.attr('r', 1)
				.attr("data-tooltip", tooltipText)
				.on("mouseover", tooltipShow)
				.on("mouseout", tooltipHide)
				.transition(transition)
				.attr('width', d => xScale(valueTo(d)) - xScale(valueFrom(d)));
		}
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
			score: parseInt(row["score"]),
			location: row["location"]
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