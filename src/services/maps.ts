export const getAddress = async (
	lat: number,
	lng: number
): Promise<google.maps.GeocoderResult[] | null> => {
	const geocoder = new window.google.maps.Geocoder();
	const OK = window.google.maps.GeocoderStatus.OK;
	const location = new google.maps.LatLng({
		lat,
		lng,
	});

	return new Promise(function (resolve, reject) {
		geocoder.geocode(
			{
				location,
			},
			function (results, status) {
				if (status !== OK) {
					reject(status);
				}
				resolve(results);
			}
		);
	});
};
