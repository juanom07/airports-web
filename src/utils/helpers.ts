export const calcCrow = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1R = toRad(lat1);
  var lat2R = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1R) * Math.cos(lat2R);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d / 0.539957;
}

export const middlePoint = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  var dLng = toRad((lng2 - lng1));

  lat1 = toRad(lat1);
  lat2 = toRad(lat2);
  lng1 = toRad(lng1);

  var bX = Math.cos(lat2) * Math.cos(dLng);
  var bY = Math.cos(lat2) * Math.sin(dLng);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  return { lat: toDeg(lat3), lng: toDeg(lng3) };
}
const toRad = (value: number) => {
  return value * Math.PI / 180;
}

const toDeg = (value: number) => {
  return value * 180 / Math.PI;
}