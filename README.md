# ✈️ Public airports database

GitHub based API service

[![DB Update](https://github.com/jbud/runways-db/actions/workflows/db-update.yml/badge.svg?branch=main)](https://github.com/jbud/runways-db/actions/workflows/db-update.yml)

This is a JSON database of airports with their runways, communication frequencies, navaids, countries, and regions information. The database is not 100% accurate and can have older data, so do not use it for a real flight or very sensitive applications. It works well to get basic information about the airport.

Data is based on [ourairports.com](https://ourairports.com/) database. You can download the raw CSV files from [raw](https://github.com/jbud/runways-db/tree/main/raw) directory.
The repository will be updated automatically every day at 7:00 UTC. You can get the latest CSV files here: [https://ourairports.com/data/](https://ourairports.com/data/)

|                 | Number registered |
| --------------- | ----------------- |
| Airports        | 74 658            |
| Runways         | 47 002            |

## How to use it?

> Haugesund International Airport, Karmøy [ENHD](https://github.com/jbud/runways-db/blob/main/icao/ENHD.json)

The main idea of this repository is to get the `JSON` data about the airport by using its ICAO code.

Every airport has its own JSON file placed in [icao](https://github.com/jbud/runways-db/tree/main/icao) directory.

To get information about the airport use the following url:

`https://raw.githubusercontent.com/jbud/runways-db/main/icao/<enter your ICAO>.json`

**Note**: ICAO code must be in uppercase

For example:

```bash
  curl https://raw.githubusercontent.com/jbud/runways-db/main/icao/ENHD.json
```

If airport is not found, http status 404 (not found) is returned.

Have ideas on how to improve this? Feel free to create a [GitHub Issue](https://github.com/jbud/runways-db/issues).

This API is based on the fine work by [epranka](https://github.com/epranka/airports-db).
