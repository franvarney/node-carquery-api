# node-carquery-api

## Usage

```
const CarQuery = require('carquery-api');

CarQuery.getYears((err, results) => {
  if (err) return err;
  return console.log(results); // { minYear: 1940, maxYear: 2016 }
});
```

## Functions
- `getMakes` - gets all makes
- `getModel` - gets model details for a model
- `getModels`- gets all models for a make
- `getTrims` - gets details of various models
- `getYears` - gets the minimum and maximum years

## Lint
`npm run lint`

## Test
`npm test`
