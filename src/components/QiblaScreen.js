import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Platform,
  PermissionsAndroid
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import CompassHeading from 'react-native-compass-heading';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QiblaScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location to show Qibla direction.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Calculate Qibla direction
  const calculateQiblaDirection = (lat, lng) => {
    const kaabaLat = deg2rad(21.4225);
    const kaabaLng = deg2rad(39.8262);
    lat = deg2rad(lat);
    lng = deg2rad(lng);
    const dLon = kaabaLng - lng;
    const y = Math.sin(dLon);
    const x = Math.cos(lat) * Math.tan(kaabaLat) - Math.sin(lat) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = rad2deg(brng);
    return (brng + 360) % 360;
  };

  const deg2rad = d => (Math.PI * d) / 180;
  const rad2deg = r => (180 * r) / Math.PI;

  // Get current location
  const getLocation = async () => {
    setLoading(true);
    setError(null);
    
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      setError('Location permission denied');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        const qibla = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(qibla);
        setLoading(false);
      },
      (error) => {
        setError('Error getting location: ' + error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Start compass
  useEffect(() => {
    const degree_update_rate = 3;
    setUpdateIntervalForType(SensorTypes.magnetometer, degree_update_rate);
    
    CompassHeading.start(degree_update_rate, heading => {
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);

  // Get location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  // Calculate rotation for compass
  const getRotationStyle = () => {
    if (!location) return { transform: [{ rotate: '0deg' }] };
    const rotation = compassHeading - qiblaDirection;
    return { transform: [{ rotate: `${rotation}deg` }] };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Qibla Direction</Text>
        <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={48} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={getLocation}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.qiblaContainer}>
            <View style={styles.compassContainer}>
              <View style={[styles.compass, getRotationStyle()]}>
                <Icon name="arrow-upward" size={48} color="#4CAF50" />
              </View>
              <Text style={styles.compassText}>{Math.round(compassHeading)}°</Text>
            </View>
            <Text style={styles.instructions}>
              Point the arrow towards the Qibla direction. The arrow will automatically adjust as you move your device.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  qiblaContainer: {
    alignItems: 'center',
  },
  compassContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  compass: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 16,
  },
  compassText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default QiblaScreen; 