
import { db, doc, setDoc } from './firebase';
import { mockSensorData, mockDevices, mockCrops, mockWeatherForecast, generateHistoricalData } from './mock-data';

/**
 * Seed Firebase with initial data for development purposes
 * This function should only be used during development to populate the database
 */
export const seedFirebaseData = async () => {
  try {
    console.log('Seeding Firebase with initial data...');
    
    // Seed sensors
    for (const sensor of mockSensorData) {
      await setDoc(doc(db, 'sensors', sensor.id), {
        ...sensor,
        timestamp: new Date().toISOString()
      });
      console.log(`Sensor ${sensor.id} added`);
      
      // Seed sensor history data
      const sensorType = sensor.id.split('-')[0];
      let dataType: "temperature" | "humidity" | "co2" | "airflow";
      
      switch (sensorType) {
        case "temp":
          dataType = "temperature";
          break;
        case "humidity":
          dataType = "humidity";
          break;
        case "co2":
          dataType = "co2";
          break;
        case "airflow":
          dataType = "airflow";
          break;
        default:
          dataType = "temperature";
      }
      
      // Generate some history data
      const historyData = generateHistoricalData(dataType, 24);
      
      // Save each history point
      for (let i = 0; i < historyData.length; i++) {
        const point = historyData[i];
        await setDoc(doc(db, 'sensor_history', `${sensor.id}-${i}`), {
          sensorId: sensor.id,
          ...point
        });
      }
    }
    
    // Seed devices
    for (const device of mockDevices) {
      await setDoc(doc(db, 'devices', device.id), device);
      console.log(`Device ${device.id} added`);
    }
    
    // Seed crops
    for (const crop of mockCrops) {
      await setDoc(doc(db, 'crops', crop.id), crop);
      console.log(`Crop ${crop.id} added`);
    }
    
    // Seed weather forecasts
    for (let i = 0; i < mockWeatherForecast.length; i++) {
      const forecast = mockWeatherForecast[i];
      await setDoc(doc(db, 'weather_forecasts', `forecast-${i}`), forecast);
      console.log(`Weather forecast for ${forecast.date} added`);
    }
    
    console.log('Firebase seeding completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Error seeding Firebase data:', error);
    return { success: false, error };
  }
};
