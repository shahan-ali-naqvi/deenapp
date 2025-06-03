import { StyleSheet, Text, View, SafeAreaView, ScrollView, PermissionsAndroid, Platform, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import Geolocation from 'react-native-geolocation-service'
import { Coordinates, CalculationMethod, Prayer, PrayerTimes, Madhab } from 'adhan'

/**
 * Islamic Prayer Times Calculator
 * Using Adhan library for high-precision calculations
 * Based on formulas from: https://radhifadlillah.com/blog/2020-09-06-calculating-prayer-times/
 */

const PrayerTimesScreen = () => {
  const [location, setLocation] = useState({ latitude: 21.3891, longitude: 39.8579 }) // Default to Mecca
  const [elevation, setElevation] = useState(0)
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [calculationMethod, setCalculationMethod] = useState('MuslimWorldLeague')
  const [loading, setLoading] = useState(true) // Start with loading true
  const [locationError, setLocationError] = useState(null)
  const [date, setDate] = useState(new Date())
  
  // Request location permissions for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse')
      if (auth === 'granted') {
        return true
      }
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Prayer Times needs access to your location to provide accurate prayer times.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch (err) {
        console.warn(err)
        return false
      }
    }
    return false
  }

  // Get current location with high accuracy
  const getCurrentLocation = async () => {
    setLocationError(null)
    
    const hasPermission = await requestLocationPermission()
    
    if (!hasPermission) {
      setLocationError('Location permission denied. Using default location.')
      setLoading(false)
      // Use default location if permission denied
      calculatePrayerTimes(location.latitude, location.longitude, elevation)
      return
    }
    
    // Use a better accuracy setting
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords
        
        console.log('Got coordinates:', latitude, longitude, altitude || 'No elevation data')
        
        // Save the location data
        setLocation({
          latitude,
          longitude,
        })
        
        // Save elevation data if available
        if (altitude !== null) {
          setElevation(altitude)
        }
        
        setLoading(false)
        
        // Calculate prayer times with new coordinates and elevation
        calculatePrayerTimes(latitude, longitude, altitude || 0)
      },
      (error) => {
        console.log('Geolocation error:', error)
        setLocationError(`Location error: ${error.message}. Using default coordinates.`)
        setLoading(false)
        // Use default location if can't get current location
        calculatePrayerTimes(location.latitude, location.longitude, elevation)
      },
      { 
        enableHighAccuracy: true,  // Use GPS for more accurate results
        timeout: 20000,            // Longer timeout for better results
        maximumAge: 0,             // Always get fresh location
        distanceFilter: 0,         // Update on any movement
      }
    )
  }

  // Function to update current date
  const updateDate = useCallback(() => {
    setDate(new Date())
  }, [])

  // Calculate accurate prayer times using Adhan library
  const calculatePrayerTimes = (lat, long, elev = 0) => {
    try {
      // Get current date for calculation
      const currentDate = new Date()
      setDate(currentDate)
      
      // Create coordinates object for Adhan
      const coordinates = new Coordinates(lat, long)
      
      // Get calculation parameters
      const params = CalculationMethod[calculationMethod]()
      
      // Always use Hanafi madhab for Asr time
      params.madhab = Madhab.Hanafi
      
      console.log('Calculating prayer times with Adhan library:')
      console.log(`Lat: ${lat}, Long: ${long}, Method: ${calculationMethod}, Madhab: Hanafi`)
      
      // Calculate prayer times using Adhan
      const prayerTimes = new PrayerTimes(coordinates, currentDate, params)
      
      // Format prayer times with 12-hour format
      const formattedTimes = {
        fajr: formatTime(prayerTimes.fajr),
        sunrise: formatTime(prayerTimes.sunrise),
        dhuhr: formatTime(prayerTimes.dhuhr),
        asr: formatTime(prayerTimes.asr),
        maghrib: formatTime(prayerTimes.maghrib),
        isha: formatTime(prayerTimes.isha)
      }
      
      console.log('Adhan calculated times:', formattedTimes)
      setPrayerTimes(formattedTimes)
    } catch (error) {
      console.error('Error calculating prayer times:', error)
      setLocationError('Error calculating prayer times. Please try again.')
    }
  }

  // Format time to 12-hour format with AM/PM
  const formatTime = (date) => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    
    hours = hours % 12
    hours = hours ? hours : 12 // Handle midnight (0 hours)
    
    return {
      decimal: date,
      formatted: `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
    }
  }

  // Calculate times on component mount with default location
  useEffect(() => {
    // Try to get current location right away - will also trigger initial calculation
    getCurrentLocation()
    
    // Set up a timer to update the date and recalculate every day at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const timeUntilMidnight = tomorrow - now
    
    // Set timeout for midnight update
    const midnightTimer = setTimeout(() => {
      updateDate()
      getCurrentLocation() // Get fresh location at midnight
      
      // Then set interval for daily updates
      const dailyInterval = setInterval(() => {
        updateDate()
        getCurrentLocation() // Fresh location each day
      }, 24 * 60 * 60 * 1000) // 24 hours
      
      return () => clearInterval(dailyInterval)
    }, timeUntilMidnight)
    
    // Also refresh location and calculation every hour for better accuracy
    const hourlyInterval = setInterval(() => {
      calculatePrayerTimes(location.latitude, location.longitude, elevation)
    }, 60 * 60 * 1000) // 1 hour
    
    // Refresh location every 30 minutes
    const locationInterval = setInterval(() => {
      getCurrentLocation()
    }, 30 * 60 * 1000) // 30 minutes
    
    return () => {
      clearTimeout(midnightTimer)
      clearInterval(hourlyInterval)
      clearInterval(locationInterval)
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <View style={styles.header}>
          <Text style={styles.title}>Prayer Time</Text>
          <Text style={styles.subtitle}>100% Offline - Hanafi Method</Text>
        </View> */}

        <View style={styles.locationCard}>
          <Text style={styles.cardTitle}>Your Location</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066cc" />
              <Text style={styles.loadingText}>Getting your location...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.locationText}>
                Latitude: {location.latitude.toFixed(4)}° | Longitude: {location.longitude.toFixed(4)}°
              </Text>
              <Text style={styles.locationText}>
                Elevation: {elevation.toFixed(1)}m | Timezone: {-date.getTimezoneOffset() / 60}
              </Text>
             {/* <Text style={styles.methodText}>
                Method: {calculationMethod} | Asr: Hanafi
              </Text> */}
              {locationError && <Text style={styles.errorText}>{locationError}</Text>}
            </>
          )}
        </View>

        {prayerTimes && (
          <View style={styles.timesCard}>
            <Text style={styles.cardTitle}>Prayer Times for {date.toLocaleDateString()}</Text>
            <View style={styles.timeRow}>
              <Text style={styles.prayerName}>Fajr:</Text>
              <Text style={styles.prayerTime}>{prayerTimes.fajr.formatted}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.prayerName}>Sunrise:</Text>
              <Text style={styles.prayerTime}>{prayerTimes.sunrise.formatted}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.prayerName}>Zuhr:</Text>
              <Text style={styles.prayerTime}>{prayerTimes.dhuhr.formatted}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.prayerName}>Asr:</Text>
              <Text style={styles.prayerTime}>{prayerTimes.asr.formatted}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.prayerName}>Maghrib:</Text>
              <Text style={styles.prayerTime}>{prayerTimes.maghrib.formatted}</Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.prayerName}>Isha:</Text>
              <Text style={styles.prayerTime}>{prayerTimes.isha.formatted}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default PrayerTimesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  methodText: {
    fontSize: 14,
    color: '#555',
  },
  timesCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  prayerName: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
})