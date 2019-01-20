var apiKey = 'cad8f9e5-dc42-427e-b4b4-d8a5289395ef'

function loadBus(busline) {
  $.getScript('https://bus-load.mta.info/api/siri/vehicle-monitoring.json?key=cad8f9e5-dc42-427e-b4b4-d8a5289395ef&OperatorRef=MTA NYCT&LineRef=MTA NYCT_M4&callback=displayBus')
}
// 112th st. West side
'https://bus-load.mta.info/api/siri/stop-monitoring.json?key=cad8f9e5-dc42-427e-b4b4-d8a5289395ef&OperatorRef=MTA NYCT&MonitoringRef=MTA_403149&callback=__jp97'

// 98th st. East side
'https://bus-load.mta.info/api/siri/stop-monitoring.json?key=cad8f9e5-dc42-427e-b4b4-d8a5289395ef&OperatorRef=MTA NYCT&MonitoringRef=MTA_400041&callback=__jp5'

function loadBusStop(busStop, buslines, targetDiv) {
  var url = 'https://bus-load.mta.info/api/siri/stop-monitoring.json?key='+apiKey+'&OperatorRef=MTA NYCT&MonitoringRef='+busStop
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function(data) {
      var svc = data.Siri.ServiceDelivery
      var journeyArray = svc.StopMonitoringDelivery[0].MonitoredStopVisit
      //var serviceArray = svc.SituationExchangeDelivery[0].PtSituationElement
      journeyArray.forEach((bus) => {
        var j = bus.MonitoredVehicleJourney
        if (j && buslines.indexOf(j.LineRef) >= 0) {
          var stopsAway = j.MonitoredCall.Extensions.Distances.StopsFromCall
          var expectedArrival = j.MonitoredCall.ExpectedArrivalTime
          var arrivalMinutes = parseInt((Number(new Date(expectedArrival)) - Number(new Date())) / 1000 / 60)
          var vehicleRef = j.VehicleRef
          targetDiv.append(`<li>${arrivalMinutes}min away -- ${stopsAway} stops away (${vehicleRef})</li>`)
        }
      })
    }
  })
}

loadBusStop('MTA_400041', ["MTA NYCT_M4", "MTA NYCT_M3"], $('#uptown'))
loadBusStop('MTA_403149', ["MTA NYCT_M4"], $('#downtown'))
/*
__jp5(
  {"Siri":
   {"ServiceDelivery":
    {"ResponseTimestamp":"2019-01-19T21:38:08.921-05:00",
     "StopMonitoringDelivery":[
       {"MonitoredStopVisit":[
         {"MonitoredVehicleJourney": {
           "LineRef":"MTA NYCT_M4",
           "DirectionRef":"0",
           "FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-128600_M4_148"},
           "JourneyPatternRef":"MTA_M040871",
           "PublishedLineName":"M4","OperatorRef":"MTA NYCT","OriginRef":"MTA_400353","DestinationRef":"MTA_400636","DestinationName":"WASH HTS CABRINI BLV via MADSON via BWAY",
           "SituationRef":[{"SituationSimpleRef":"MTA NYCT_2311795e-93ca-4eea-ac49-edc948ae9096"}],
           "Monitored":true,
           "VehicleLocation":{"Longitude":-73.97268,"Latitude":40.761837},
           "Bearing":54.223923,"ProgressRate":"normalProgress",
           "BlockRef":"MTA NYCT_MV_A9-Saturday_A_MV_43260_M4-134",
           "VehicleRef":"MTA NYCT_6387",
           "MonitoredCall":{
             "ExpectedArrivalTime":"2019-01-19T21:49:55.895-05:00",
             "ExpectedDepartureTime":"2019-01-19T21:49:55.895-05:00",
             "Extensions":{
               "Distances":{
                 "PresentableDistance":"2.1 miles away",
                 "DistanceFromCall":3380.61,
                 "StopsFromCall":16,
                 "CallDistanceAlongRoute":5311.2}},
             "StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:55.000-05:00"},

{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M4","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-130300_M4_150"},"JourneyPatternRef":"MTA_M040871","PublishedLineName":"M4","OperatorRef":"MTA NYCT","OriginRef":"MTA_400353","DestinationRef":"MTA_400636","DestinationName":"WASH HTS CABRINI BLV via MADSON via BWAY","OriginAimedDepartureTime":"2019-01-19T21:43:00.000-05:00","SituationRef":[],"Monitored":true,"VehicleLocation":{"Longitude":-73.984676,"Latitude":40.746797},"Bearing":337.2785,"ProgressRate":"noProgress","ProgressStatus":"layover,prevTrip","BlockRef":"MTA NYCT_MV_A9-Saturday_A_MV_45240_M4-141","VehicleRef":"MTA NYCT_6631","MonitoredCall":{"ExpectedArrivalTime":"2019-01-19T22:04:37.878-05:00","ExpectedDepartureTime":"2019-01-19T22:04:37.878-05:00","Extensions":{"Distances":{"PresentableDistance":"3.4 miles away","DistanceFromCall":5407.96,"StopsFromCall":27,"CallDistanceAlongRoute":5311.2}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:57.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M1","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_OF_A9-Saturday-125400_M1_135"},"JourneyPatternRef":"MTA_M010206","PublishedLineName":"M1","OperatorRef":"MTA NYCT","OriginRef":"MTA_903130","DestinationRef":"MTA_803003","DestinationName":"HARLEM 147 ST via MADISON","SituationRef":[{"SituationSimpleRef":"MTA NYCT_2311795e-93ca-4eea-ac49-edc948ae9096"}],"Monitored":true,"VehicleLocation":{"Longitude":-73.987747,"Latitude":40.738175},"Bearing":54.09028,"ProgressRate":"normalProgress","BlockRef":"MTA NYCT_OF_A9-Saturday_A_OF_38040_M1-119","VehicleRef":"MTA NYCT_6407","MonitoredCall":{"ExpectedArrivalTime":"2019-01-19T22:06:10.685-05:00","ExpectedDepartureTime":"2019-01-19T22:06:10.685-05:00","Extensions":{"Distances":{"PresentableDistance":"4.0 miles away","DistanceFromCall":6460.47,"StopsFromCall":30,"CallDistanceAlongRoute":8633.12}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:50.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M2","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-130000_M2_141"},"JourneyPatternRef":"MTA_M020209","PublishedLineName":"M2","OperatorRef":"MTA NYCT","OriginRef":"MTA_400001","DestinationRef":"MTA_404876","DestinationName":"WASHINGTON HTS BWAY - 168 ST via MADISON","SituationRef":[{"SituationSimpleRef":"MTA NYCT_2311795e-93ca-4eea-ac49-edc948ae9096"}],"Monitored":true,"VehicleLocation":{"Longitude":-73.988415,"Latitude":40.737245},"Bearing":54.55429,"ProgressRate":"normalProgress","VehicleRef":"MTA NYCT_3848","MonitoredCall":{"ExpectedArrivalTime":"2019-01-19T22:06:24.567-05:00","ExpectedDepartureTime":"2019-01-19T22:06:24.567-05:00","Extensions":{"Distances":{"PresentableDistance":"4.1 miles away","DistanceFromCall":6578.24,"StopsFromCall":30,"CallDistanceAlongRoute":7277.11}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:38:06.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M3","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-129000_M3_237"},"JourneyPatternRef":"MTA_M030257","PublishedLineName":"M3","OperatorRef":"MTA NYCT","OriginRef":"MTA_400001","DestinationRef":"MTA_903219","DestinationName":"FT GEORGE 193 ST via MADSON via ST. NICH","SituationRef":[{"SituationSimpleRef":"MTA NYCT_2311795e-93ca-4eea-ac49-edc948ae9096"}],"Monitored":true,"VehicleLocation":{"Longitude":-73.98866,"Latitude":40.736897},"Bearing":54.914948,"ProgressRate":"normalProgress","BlockRef":"MTA NYCT_MV_A9-Saturday_A_MV_28800_M3-211","VehicleRef":"MTA NYCT_6379","MonitoredCall":{"ExpectedArrivalTime":"2019-01-19T22:07:31.127-05:00","ExpectedDepartureTime":"2019-01-19T22:07:31.127-05:00","Extensions":{"Distances":{"PresentableDistance":"4.1 miles away","DistanceFromCall":6622.12,"StopsFromCall":30,"CallDistanceAlongRoute":7277.11}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:38:00.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M3","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-130500_M3_238"},"JourneyPatternRef":"MTA_M030257","PublishedLineName":"M3","OperatorRef":"MTA NYCT","OriginRef":"MTA_400001","DestinationRef":"MTA_903219","DestinationName":"FT GEORGE 193 ST via MADSON via ST. NICH","OriginAimedDepartureTime":"2019-01-19T21:45:00.000-05:00","SituationRef":[],"Monitored":true,"VehicleLocation":{"Longitude":-73.991263,"Latitude":40.730106},"Bearing":337.26562,"ProgressRate":"noProgress","ProgressStatus":"layover,prevTrip","BlockRef":"MTA NYCT_MV_A9-Saturday_A_MV_39840_M3-221","VehicleRef":"MTA NYCT_6637","MonitoredCall":{"ExpectedArrivalTime":"2019-01-19T22:17:46.186-05:00","ExpectedDepartureTime":"2019-01-19T22:17:46.186-05:00","Extensions":{"Distances":{"PresentableDistance":"4.6 miles away","DistanceFromCall":7419.45,"StopsFromCall":35,"CallDistanceAlongRoute":7277.11}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:38:03.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M3","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-132500_M3_239"},"JourneyPatternRef":"MTA_M030257","PublishedLineName":"M3","OperatorRef":"MTA NYCT","OriginRef":"MTA_400001","DestinationRef":"MTA_903219","DestinationName":"FT GEORGE 193 ST via MADSON via ST. NICH","OriginAimedDepartureTime":"2019-01-19T22:05:00.000-05:00","SituationRef":[],"Monitored":true,"VehicleLocation":{"Longitude":-73.994414,"Latitude":40.734895},"Bearing":233.1301,"ProgressRate":"normalProgress","ProgressStatus":"prevTrip","BlockRef":"MTA NYCT_MV_A9-Saturday_A_MV_40920_M3-207","VehicleRef":"MTA NYCT_6425","MonitoredCall":{"Extensions":{"Distances":{"PresentableDistance":"5.1 miles away","DistanceFromCall":8261.95,"StopsFromCall":40,"CallDistanceAlongRoute":7277.11}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:38:03.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M1","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_OF_A9-Saturday-128000_M1_139"},"JourneyPatternRef":"MTA_M010206","PublishedLineName":"M1","OperatorRef":"MTA NYCT","OriginRef":"MTA_903130","DestinationRef":"MTA_803003","DestinationName":"HARLEM 147 ST via MADISON","SituationRef":[{"SituationSimpleRef":"MTA NYCT_2311795e-93ca-4eea-ac49-edc948ae9096"}],"Monitored":true,"VehicleLocation":{"Longitude":-73.997716,"Latitude":40.720714},"Bearing":59.743565,"ProgressRate":"normalProgress","BlockRef":"MTA NYCT_OF_A9-Saturday_A_OF_39480_M1-121","VehicleRef":"MTA NYCT_6781","MonitoredCall":{"ExpectedArrivalTime":"2019-01-19T22:18:02.278-05:00","ExpectedDepartureTime":"2019-01-19T22:18:02.278-05:00","Extensions":{"Distances":{"PresentableDistance":"5.4 miles away","DistanceFromCall":8627.48,"StopsFromCall":39,"CallDistanceAlongRoute":8633.12}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:57.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M1","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_OF_A9-Saturday-129500_M1_136"},"JourneyPatternRef":"MTA_M010206","PublishedLineName":"M1","OperatorRef":"MTA NYCT","OriginRef":"MTA_903130","DestinationRef":"MTA_803003","DestinationName":"HARLEM 147 ST via MADISON","OriginAimedDepartureTime":"2019-01-19T21:35:00.000-05:00","SituationRef":[],"Monitored":true,"VehicleLocation":{"Longitude":-73.990874,"Latitude":40.739753},"Bearing":234.55429,"ProgressRate":"normalProgress","ProgressStatus":"prevTrip","BlockRef":"MTA NYCT_OF_A9-Saturday_A_OF_51060_M1-117","VehicleRef":"MTA NYCT_3830","MonitoredCall":{"Extensions":{"Distances":{"PresentableDistance":"7.2 miles away","DistanceFromCall":11588.94,"StopsFromCall":55,"CallDistanceAlongRoute":8633.12}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:43.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M3","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_MV_A9-Saturday-134400_M3_240"},"JourneyPatternRef":"MTA_M030257","PublishedLineName":"M3","OperatorRef":"MTA NYCT","OriginRef":"MTA_400001","DestinationRef":"MTA_903219","DestinationName":"FT GEORGE 193 ST via MADSON via ST. NICH","OriginAimedDepartureTime":"2019-01-19T22:24:00.000-05:00","SituationRef":[],"Monitored":true,"VehicleLocation":{"Longitude":-73.971552,"Latitude":40.766265},"Bearing":233.86462,"ProgressRate":"normalProgress","ProgressStatus":"prevTrip","BlockRef":"MTA NYCT_MV_A9-Saturday_A_MV_21240_M3-203","VehicleRef":"MTA NYCT_6638","MonitoredCall":{"Extensions":{"Distances":{"PresentableDistance":"7.6 miles away","DistanceFromCall":12246.66,"StopsFromCall":57,"CallDistanceAlongRoute":7277.11}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:36.000-05:00"},{"MonitoredVehicleJourney":{"LineRef":"MTA NYCT_M1","DirectionRef":"0","FramedVehicleJourneyRef":{"DataFrameRef":"2019-01-19","DatedVehicleJourneyRef":"MTA NYCT_OF_A9-Saturday-131000_M1_140"},"JourneyPatternRef":"MTA_M010206","PublishedLineName":"M1","OperatorRef":"MTA NYCT","OriginRef":"MTA_903130","DestinationRef":"MTA_803003","DestinationName":"HARLEM 147 ST via MADISON","OriginAimedDepartureTime":"2019-01-19T21:50:00.000-05:00","SituationRef":[],"Monitored":true,"VehicleLocation":{"Longitude":-73.986029,"Latitude":40.74642},"Bearing":234.63754,"ProgressRate":"normalProgress","ProgressStatus":"prevTrip","BlockRef":"MTA NYCT_OF_A9-Saturday_A_OF_31740_M1-108","VehicleRef":"MTA NYCT_3834","MonitoredCall":{"Extensions":{"Distances":{"PresentableDistance":"7.7 miles away","DistanceFromCall":12435.35,"StopsFromCall":59,"CallDistanceAlongRoute":8633.12}},"StopPointRef":"MTA_400041","VisitNumber":1,"StopPointName":"MADISON AV/E 98 ST"},"OnwardCalls":{}},"RecordedAtTime":"2019-01-19T21:37:57.000-05:00"}],"ResponseTimestamp":"2019-01-19T21:38:08.921-05:00","ValidUntil":"2019-01-19T21:39:08.921-05:00"}],


"SituationExchangeDelivery":[{"Situations":{"PtSituationElement":[{
  "PublicationWindow":{"StartTime":"2019-01-11T15:02:00.000-05:00"},
  "Severity":"undefined",
  "Summary":"Northbound M1, M2, M3 and M4 buses are bypassing the bus stop on Madison Av between 95 St and 96 St because of icing conditions.",
  "Description":"Northbound M1, M2, M3 and M4 buses are bypassing the bus stop on Madison Av between 95 St and 96 St because of icing conditions.",
  "Affects":{"VehicleJourneys":{"AffectedVehicleJourney":[{"LineRef":"MTA NYCT_M1","DirectionRef":"0"},{"LineRef":"MTA NYCT_M1","DirectionRef":"0"},{"LineRef":"MTA NYCT_M2","DirectionRef":"0"},{"LineRef":"MTA NYCT_M2","DirectionRef":"0"},{"LineRef":"MTA NYCT_M3","DirectionRef":"0"},{"LineRef":"MTA NYCT_M4","DirectionRef":"0"},{"LineRef":"MTA NYCT_M4","DirectionRef":"0"}]}},"CreationTime":"2019-01-19T18:01:44.600-05:00",
                                                                   "SituationNumber":"MTA NYCT_2311795e-93ca-4eea-ac49-edc948ae9096"}]}}]}}})
*/
