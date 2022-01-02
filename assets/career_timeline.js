"use strict";

(function (d3) {
  'use strict';

  var chartDiv = document.getElementById("chart");
  var svg = d3.select(chartDiv).append("svg"); // Prep the tooltip bits, initial display is hidden

  var tooltip = d3.select("body").append("div").attr("class", "timeline_tooltip").style("opacity", 0);

  function tooltipShow() {
    var text = this.dataset.tooltip;
    var x = d3.event.pageX;
    var y = d3.event.pageY - 28;
    tooltip.transition().duration(200).style("opacity", 1);
    tooltip.html(text).style("width", null).style("left", "".concat(x + 20, "px")).style("top", "".concat(y, "px"));

    if (d3.event.pageX > chartDiv.clientWidth * 2 / 3) {
      tooltip.style("width", "210px").style("left", "".concat(x - 260, "px"));
    }
  }

  function tooltipHide() {
    tooltip.transition().duration(500).style("opacity", 0);
  } // PLOT AREA


  var margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 30
  };
  var g = svg.append('g');
  var xAxisG = g.append('g');
  var yAxisG = g.append('g');

  function toDate(d) {
    if (d == null || d == "") {
      return null;
    }

    if (d == "TODAY()") {
      return new Date();
    }

    return new Date(d);
  }

  var valueFrom = function valueFrom(d) {
    return d.from;
  };

  var valueTo = function valueTo(d) {
    return d.to;
  };

  var jobTooltipText = function jobTooltipText(d) {
    return "<h3>" + d.title + "</h3>" + d.company + "<br>" + d.location;
  };

  var eventTooltipText = function eventTooltipText(d) {
    return "<h3>" + d.label + "</h3>" + d.title + "<br>" + d.company;
  };

  var render = function render(data) {
    // calculate sizes based of window size and margins
    var width = chartDiv.clientWidth;
    var height = chartDiv.clientHeight;
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;
    console.log("Width: " + width + ", Height: " + height);
    svg.attr("width", width).attr("height", height);
    g.attr('transform', "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    var xMin = new Date("2005-01-01"); // d3.min(data.map(valueFrom));

    var xMax = d3.max(data.map(valueTo)); // X axis

    var xScale = d3.scaleTime().domain([xMin, xMax]).range([0, innerWidth]).nice();
    var xAxis = d3.axisBottom(xScale);
    xAxisG.call(xAxis).attr('transform', "translate(0,".concat(innerHeight, ")"));
    xAxisG.selectAll('.domain').remove(); // Y axis

    var yScale = d3.scaleBand().domain(["Teaching", "Copenhagen", "School", "DataCleaner", "Seattle"]) // TODO: Make dynamic
    .range([0, innerHeight]); // Plot

    var transition = d3.transition().duration(1000);
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    var radiusScale = function radiusScale(d) {
      return 1.5 * d;
    };

    var randomInt = function randomInt(n) {
      return Math.floor(Math.random() * n + 1);
    };

    var discreteOpacity = 0.05;
    var rectShadowWidth = 15;
    var dataJob = data.filter(function (d) {
      return d.type == "job";
    });
    var dataEvent = data.filter(function (d) {
      return d.type == "event";
    });
    var jobScatter = g.selectAll('g.plotitem_job_group').data(dataJob);
    var jobGroups = jobScatter.enter().append('g').attr("class", "plotitem_job_group").merge(jobScatter);
    jobGroups.selectAll("rect").remove();
    jobGroups.selectAll("text").remove();
    jobGroups.append("rect").attr('x', function (d) {
      return xScale(valueFrom(d)) - randomInt(rectShadowWidth);
    }).attr('y', function (d) {
      return yScale(d.swimlane) + 1.5 * d.score - randomInt(rectShadowWidth);
    }).attr('width', function (d) {
      return 1;
    }).attr('height', function (d) {
      return randomInt(rectShadowWidth * 2) + 5 * d.score;
    }).attr('fill', "black").attr('fill-opacity', discreteOpacity).transition(transition).attr('width', function (d) {
      return randomInt(rectShadowWidth * 2) + xScale(valueTo(d)) - xScale(valueFrom(d));
    });
    jobGroups.append("rect").attr("class", "plotitem").attr('x', function (d) {
      return xScale(valueFrom(d));
    }).attr('y', function (d) {
      return yScale(d.swimlane) + 1.5 * d.score;
    }).attr('width', function (d) {
      return 1;
    }).attr('height', function (d) {
      return 5 * d.score;
    }).attr('fill', function (d) {
      return colorScale(d.swimlane);
    }).attr('fill-opacity', function (d) {
      return d.score / 10.0;
    }).attr("data-tooltip", jobTooltipText).on("mouseover", tooltipShow).on("mouseout", tooltipHide).transition(transition).attr('width', function (d) {
      return xScale(valueTo(d)) - xScale(valueFrom(d));
    });
    jobGroups.append("text").attr("fill", "white").attr('x', function (d) {
      return xScale(valueFrom(d)) + 3;
    }).attr('y', function (d) {
      return yScale(d.swimlane) + 1.5 * d.score + 12;
    }).text(function (d) {
      return d.label;
    });
    var eventScatter = g.selectAll('g.plotitem_event_group').data(dataEvent);
    var eventGroups = eventScatter.enter().append('g').attr("class", "plotitem_event_group").merge(eventScatter);
    eventGroups.selectAll("circle").remove();
    eventGroups.append("circle").attr('cy', function (d) {
      return d.swimlane;
    }).attr('cx', function (d) {
      return xScale(valueFrom(d));
    }).attr('fill', "black").attr('fill-opacity', discreteOpacity).attr('r', 1).transition(transition).attr('r', function (d) {
      return radiusScale(d.score) * 2;
    });
    eventGroups.append("circle").attr("class", "plotitem").attr('cy', function (d) {
      return d.swimlane;
    }).attr('cx', function (d) {
      return xScale(valueFrom(d));
    }).attr('fill', function (d) {
      return "black";
    }).attr('fill-opacity', 0.65).attr('r', 1).attr("data-tooltip", eventTooltipText).on("mouseover", tooltipShow).on("mouseout", tooltipHide).transition(transition).attr('r', function (d) {
      return radiusScale(d.score);
    });
  };

  var dataPromise = d3.tsv("/assets/data/career.tsv", function (row) {
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
  dataPromise.then(function (data) {
    render(data);
    window.addEventListener("resize", function () {
      render(data);
    });
  });
})(d3);