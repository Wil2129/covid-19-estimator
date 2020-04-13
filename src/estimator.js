const timeToElapseInDays = (timeToElapse, periodType) => {
  switch (periodType) {
    case 'days':
      return timeToElapse;

    case 'weeks':
      return timeToElapse * 7;

    case 'months':
      return timeToElapse * 30;

    default:
      return null;
  }
};

const impactEstimator = (impact, data) => {
  const { currentlyInfected } = impact;
  const {
    timeToElapse, periodType, totalHospitalBeds, region
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const daysToElapse = timeToElapseInDays(timeToElapse, periodType);
  const infectionsByRequestedTime = currentlyInfected * (2 ** Math.trunc(daysToElapse / 3));
  const severeCasesByRequestedTime = Math.trunc(
    infectionsByRequestedTime * 0.15
  );
  const hospitalBedsByRequestedTime = Math.trunc(
    (totalHospitalBeds * 0.35) - severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.05);
  const casesForVentilatorsByRequestedTime = Math.trunc(infectionsByRequestedTime * 0.02);
  const dollarsInFlight = Math.trunc(
    (infectionsByRequestedTime
      * avgDailyIncomeInUSD
      * avgDailyIncomePopulation)
      / daysToElapse
  );
  return {
    ...impact,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => {
  let impact;
  let severeImpact;
  impact = {};
  severeImpact = {};
  const { reportedCases } = data;
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  impact = impactEstimator(impact, data);
  severeImpact = impactEstimator(severeImpact, data);
  return { data, impact, severeImpact };
};

export default covid19ImpactEstimator;
