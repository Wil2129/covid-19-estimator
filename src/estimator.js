const impactEstimator = (impact, data) => {
  const { currentlyInfected } = impact;
  const { timeToElapse, totalHospitalBeds, region } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const infectionsByRequestedTime = currentlyInfected * Math.floor(timeToElapse / 3);
  const severeCasesByRequestedTime = Math.floor(
    infectionsByRequestedTime * 0.15
  );
  const hospitalBedsByRequestedTime = Math.floor(
    totalHospitalBeds * 0.35 - severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = infectionsByRequestedTime * 0.05;
  const casesForVentilatorsByRequestedTime = infectionsByRequestedTime * 0.02;
  const dollarsInFlight = Math.floor(
    (infectionsByRequestedTime
      * avgDailyIncomeInUSD
      * avgDailyIncomePopulation)
      / timeToElapse
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
