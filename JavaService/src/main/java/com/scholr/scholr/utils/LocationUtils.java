package com.scholr.scholr.utils;

public class LocationUtils {
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371000; // Earth's radius in meters

        // Latitude difference and Longitude difference (in Radians)
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        // phi = Latitude in Radians
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);

        // The Haversine square-root
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        // Central angle calculation
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Final distance in meters
    }
}
