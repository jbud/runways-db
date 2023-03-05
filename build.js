const csv = require('csv-parser');
const https = require('https');
const path = require('path');
const fs = require('fs');

const resolve = (pathname) => {
    return path.resolve(__dirname, pathname);
};

const parseCSV = (pathname) => {
    const items = [];
    return new Promise((resolve) => {
        fs.createReadStream(pathname)
            .pipe(csv())
            .on('data', (data) => items.push(data))
            .on('end', () => resolve(items));
    });
};

const mapArrayByKey = (array, key, multiple = false) => {
    const object = {};
    for (const item of array) {
        const keyValue = item[key];
        if (multiple) {
            if (!object[keyValue]) object[keyValue] = [];
            object[keyValue].push(item);
        } else {
            object[keyValue] = item;
        }
    }
    return object;
};

const downloadFile = (origin, destination) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination, { flags: 'w' });
        https
            .get(origin, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    file.close(resolve);
                });
            })
            .on('error', function (err) {
                fs.unlink(dest);
                reject(err);
            });
    });
};

const numberFormatter = new Intl.NumberFormat('nb-NO');

const replaceRow = (readme, row, value) => {
    const formattedValue = numberFormatter.format(value);
    const paddedValue = formattedValue.padEnd('0                 '.length, ' ');

    const regex = new RegExp(`(\\| ${row}[\\s]+\\|\\s)([0-9\\s]+)(\\|)`, 'i');

    return readme.replace(regex, `$1${paddedValue}$3`);
};

const updateReadme = async (numberOfAirports, numberOfRunways, numberOfFrequencies, numberOfNavaids, numberOfCountries, numberOfRegions) => {
    let readme = fs.readFileSync(resolve('README.md')) + '';

    readme = replaceRow(readme, 'Airports', numberOfAirports);
    readme = replaceRow(readme, 'Runways', numberOfRunways);

    fs.writeFileSync(resolve(`README.md`), readme);
};

const build = async () => {
    console.info('Downloading data from ourairports.com');

    await downloadFile('https://davidmegginson.github.io/ourairports-data/runways.csv', resolve('raw/runways.csv'));

    console.info('Loading data');

    const airportsArray = await parseCSV(resolve('raw/airports.csv'));
    const runwaysArray = await parseCSV(resolve('raw/runways.csv'));
    const runways = mapArrayByKey(runwaysArray, 'airport_ident', true);

    console.info(`Fetched and loaded updated data for ${airportsArray.length} airports, ${runwaysArray.length} runways`);

    if (airportsArray.length === 0) {
        console.warn('No airports found, aborting!');
        throw 'No airports found, aborting!';
    }

    console.info('Merging and converting airport data to json');
    let airports = mapArrayByKey(airportsArray, 'ident');
    let index = 0;
    for (const airport of airportsArray) {
        index++;

        airport.runways = runways[airport.ident];
        fs.writeFileSync(resolve(`icao/${airport.ident}.json`), JSON.stringify(airport, null, 4));
    }
    fs.writeFileSync(resolve(`icao.json`), JSON.stringify(airports, null, 4));
    console.info(`Converted a total of ${index} airports`);

    console.info('Updating readme');
    await updateReadme(airportsArray.length, runwaysArray.length);
};

build();
