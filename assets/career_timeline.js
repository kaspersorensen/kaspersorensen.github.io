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
		var x = d3.event.pageX;
		var y = d3.event.pageY - 28;

		tooltip.transition()
			.duration(200)
			.style("opacity", 1);
		tooltip.html(text)
			.style("width", null)
			.style("left", `${x+20}px`)
			.style("top", `${y}px`);
		if (d3.event.pageX > chartDiv.clientWidth * 2 / 3) {
			tooltip
				.style("width", "210px")
				.style("left", `${x-260}px`);
		}
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

	function toDate(d) {
		if (d == null || d == "") {
			return null;
		}
		if (d == "TODAY()") {
			return new Date();
		}
		return new Date(d);
	}
	const valueFrom = d => d.from;
	const valueTo = d => d.to;
	const jobTooltipText = d => "<h3>" + d.title + "</h3>" + d.company + "<br>" + d.location;
	const eventTooltipText = d => "<h3>" + d.label + "</h3>" + d.title + "<br>" + d.company;

	const render = data => {
		// calculate sizes based of window size and margins
		const width = chartDiv.clientWidth;
		const height = chartDiv.clientHeight;
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		console.log("Width: " + width + ", Height: " + height);
		svg.attr("width", width).attr("height", height);
		g.attr('transform', `translate(${margin.left},${margin.top})`);

		const xMin = new Date("2005-01-01") // d3.min(data.map(valueFrom));
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
		const transition = d3.transition().duration(1000);
		const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
		const radiusScale = d => 1.5 * d;
		const randomInt = n => Math.floor(Math.random() * n + 1);
		const discreteOpacity = 0.05;
		const rectShadowWidth = 15;

		const dataJob = data.filter(d => d.type == "job");
		const dataEvent = data.filter(d => d.type == "event");

		var jobScatter = g.selectAll('g.plotitem_job_group').data(dataJob);
		var jobGroups = jobScatter
			.enter().append('g').attr("class", "plotitem_job_group")
			.merge(jobScatter);
		jobGroups.selectAll("rect").remove();
		jobGroups
			.append("rect")
			.attr('x', d => xScale(valueFrom(d)) - randomInt(rectShadowWidth))
			.attr('y', d => yScale(d.swimlane) + 1.5 * d.score - randomInt(rectShadowWidth))
			.attr('width', d => 1)
			.attr('height', d => randomInt(rectShadowWidth * 2) + 5 * d.score)
			.attr('fill', "black")
			.attr('fill-opacity', discreteOpacity)
			.transition(transition)
			.attr('width', d => randomInt(rectShadowWidth * 2) + xScale(valueTo(d)) - xScale(valueFrom(d)));
		jobGroups
			.append("rect")
			.attr("class", "plotitem")
			.attr('x', d => xScale(valueFrom(d)))
			.attr('y', d => yScale(d.swimlane) + 1.5 * d.score)
			.attr('width', d => 1)
			.attr('height', d => 5 * d.score)
			.attr('fill', d => colorScale(d.swimlane))
			.attr('fill-opacity', d => d.score / 10.0)
			.attr("data-tooltip", jobTooltipText)
			.on("mouseover", tooltipShow)
			.on("mouseout", tooltipHide)
			.transition(transition)
			.attr('width', d => xScale(valueTo(d)) - xScale(valueFrom(d)));
		jobGroups
			.append("text")
			.attr("fill", "white")
			.attr('x', d => xScale(valueFrom(d)) + 3)
			.attr('y', d => yScale(d.swimlane) + 1.5 * d.score + 12)
			.text(d => d.label);

		var eventScatter = g.selectAll('g.plotitem_event_group').data(dataEvent);
		var eventGroups = eventScatter
			.enter()
			.append('g').attr("class", "plotitem_event_group")
			.merge(eventScatter);
		eventGroups.selectAll("circle").remove();
		eventGroups
			.append("circle")
			.attr('cy', d => d.swimlane)
			.attr('cx', d => xScale(valueFrom(d)))
			.attr('fill', "black")
			.attr('fill-opacity', discreteOpacity)
			.attr('r', 1)
			.transition(transition)
			.attr('r', d => radiusScale(d.score) * 2);
		eventGroups
			.append("circle")
			.attr("class", "plotitem")
			.attr('cy', d => d.swimlane)
			.attr('cx', d => xScale(valueFrom(d)))
			.attr('fill', d => "black")
			.attr('fill-opacity', 0.65)
			.attr('r', 1)
			.attr("data-tooltip", eventTooltipText)
			.on("mouseover", tooltipShow)
			.on("mouseout", tooltipHide)
			.transition(transition)
			.attr('r', d => radiusScale(d.score));
	};

	var dataPromise = d3.tsv("/assets/data/career.tsv", row => {
		var from = toDate(row["from_date"]);
		var to = toDate(row["to_date"]);
		var o = {
			type: row["type"],
			from: from,
			to: to,
			swimlane: row["swimlane"],
			label: row["label"],
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