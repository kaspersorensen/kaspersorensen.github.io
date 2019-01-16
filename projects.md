---
layout: page
title: Projects
permalink: /projects/
---

Some of my public projects ...

# DataCleaner <span class="headerlink">([website](https://datacleaner.github.io))</span>

The premier open source data quality solution. DataCleaner is a data scientists' toolkit for many if not all of the phases in data quality management. Data ingestion, wrangling, profiling, transformation, cleansing, deduplication and enrichment.

<img src="/assets/dc-screenshot-200.png" /><img src="/assets/dc-logo-200.png" />

I founded DataCleaner back in 2008 as part of my studies. Since then I partnered up with [Human Inference](http://www.humaninference.com) and [Quadient](http://www.quadient.com) to offer it as a commercial solution, too.

<hr />

# Apache MetaModel <span class="headerlink">([website](https://metamodel.apache.org))</span>

Apache MetaModel provides a uniform API for interacting with a very wide variety of datastores. The libraries allows its users to query and explore a CSV file the same way as they would treat a relational database, a NoSQL database, a CRM system or even a virtually modelled database made up of individual underlying datastores.

<img src="/assets/metamodel-logo.png" />

I'm very proud to be PMC Chair for this Apache project that I worked with Human Inference to contribute to the Apache Software Foundation.

<hr />

# .NET plugin for Apache Maven <span class="headerlink">(repo: [dotnet-maven-plugin](https://github.com/kaspersorensen/dotnet-maven-plugin))</span>

A plugin that allows you to use [Apache Maven](https://maven.apache.org) to orchestrate `dotnet` builds. The plugin supports building, executing unit tests, packaging and deploying NuGet packages and sync'ing the Maven and .NET project file versioning scheme.

<img src="/assets/dotnet-foundation-banner.jpg" />

In the [Quadient](https://www.quadient.com) Data Services teams we use this plugin a lot in order to orchestrate the build, test and release life cycle of our data services.

<hr />

# Blinkt! Jenkins monitor <span class="headerlink">(repo: [blinkt-jenkins-monitor](https://github.com/kaspersorensen/blinkt-jenkins-monitor))</span>

A for-fun project that uses the Blinkt! LED lamps on my Raspberry Pi to show the status of the latest builds on my Jenkins server.

<hr />

# Kafka record-updater <span class="headerlink">(repo: [kafka-record-updater](https://github.com/kaspersorensen/kafka-record-updater))</span>

An experimental tool used to edit/scramble messages in [Apache Kafka](https://kafka.apache.org). The tool is not at all recommended for production use, since it is not kept up to date with the latest Kafka releases. But it did serve as a very convenient tool to ensure that private data could be removed from the persistent (and usually immutable) events in a Kafka event stream.
