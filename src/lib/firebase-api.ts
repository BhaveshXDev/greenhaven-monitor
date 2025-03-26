
import { db, collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, orderBy, limit, Timestamp } from './firebase';
import { SensorData, Device, Crop, WeatherForecast } from './mock-data';

// Helper function to convert Firestore data to our app data types
const convertTimestamps = (data: any) => {
  // Convert Firestore timestamps to ISO strings for consistency
  if (!data) return data;
  
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString();
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      data[key] = convertTimestamps(data[key]);
    }
  });
  
  return data;
};

// Simulate API delays for development
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const firebaseApi = {
  // Sensor data
  getSensorData: async (): Promise<SensorData[]> => {
    try {
      const sensorsRef = collection(db, 'sensors');
      const snapshot = await getDocs(sensorsRef);
      
      if (snapshot.empty) {
        console.log('No sensors found');
        return [];
      }
      
      return snapshot.docs.map(doc => {
        const data = convertTimestamps({ id: doc.id, ...doc.data() });
        return data as SensorData;
      });
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      throw error;
    }
  },
  
  getSensorHistory: async (
    sensorId: string, 
    period: "day" | "week" | "month" = "day"
  ) => {
    try {
      // Calculate date range based on period
      const now = new Date();
      let startDate = new Date();
      
      if (period === 'day') {
        startDate.setDate(now.getDate() - 1);
      } else if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      const historyRef = collection(db, 'sensor_history');
      const q = query(
        historyRef,
        where('sensorId', '==', sensorId),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        orderBy('timestamp', 'asc')
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('No history data found');
        return [];
      }
      
      return snapshot.docs.map(doc => {
        return convertTimestamps({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error("Error fetching sensor history:", error);
      throw error;
    }
  },
  
  // Devices
  getDevices: async (): Promise<Device[]> => {
    try {
      const devicesRef = collection(db, 'devices');
      const snapshot = await getDocs(devicesRef);
      
      if (snapshot.empty) {
        console.log('No devices found');
        return [];
      }
      
      return snapshot.docs.map(doc => {
        return convertTimestamps({ id: doc.id, ...doc.data() }) as Device;
      });
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  },
  
  updateDeviceStatus: async (deviceId: string, status: Device['status']): Promise<Device> => {
    try {
      const deviceRef = doc(db, 'devices', deviceId);
      const deviceSnapshot = await getDoc(deviceRef);
      
      if (!deviceSnapshot.exists()) {
        throw new Error(`Device with ID ${deviceId} not found`);
      }
      
      const updatedDevice = {
        ...deviceSnapshot.data(),
        status,
        lastActive: new Date().toISOString()
      };
      
      await updateDoc(deviceRef, updatedDevice);
      
      return convertTimestamps({ id: deviceId, ...updatedDevice }) as Device;
    } catch (error) {
      console.error("Error updating device status:", error);
      throw error;
    }
  },
  
  setFanSpeed: async (deviceId: string, speed: number): Promise<{ success: boolean }> => {
    try {
      const deviceRef = doc(db, 'devices', deviceId);
      const deviceSnapshot = await getDoc(deviceRef);
      
      if (!deviceSnapshot.exists()) {
        throw new Error(`Device with ID ${deviceId} not found`);
      }
      
      await updateDoc(deviceRef, {
        fanSpeed: speed,
        lastUpdated: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error setting fan speed:", error);
      return { success: false };
    }
  },
  
  // Crops
  getCrops: async (): Promise<Crop[]> => {
    try {
      const cropsRef = collection(db, 'crops');
      const snapshot = await getDocs(cropsRef);
      
      if (snapshot.empty) {
        console.log('No crops found');
        return [];
      }
      
      return snapshot.docs.map(doc => {
        return convertTimestamps({ id: doc.id, ...doc.data() }) as Crop;
      });
    } catch (error) {
      console.error("Error fetching crops:", error);
      throw error;
    }
  },
  
  getCropById: async (cropId: string): Promise<Crop> => {
    try {
      const cropRef = doc(db, 'crops', cropId);
      const cropSnapshot = await getDoc(cropRef);
      
      if (!cropSnapshot.exists()) {
        throw new Error(`Crop with ID ${cropId} not found`);
      }
      
      return convertTimestamps({ id: cropId, ...cropSnapshot.data() }) as Crop;
    } catch (error) {
      console.error("Error fetching crop:", error);
      throw error;
    }
  },
  
  // Weather
  getWeatherForecast: async (): Promise<WeatherForecast[]> => {
    try {
      const forecastRef = collection(db, 'weather_forecasts');
      const q = query(forecastRef, orderBy('date', 'asc'), limit(5));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('No weather forecast found');
        return [];
      }
      
      return snapshot.docs.map(doc => {
        return convertTimestamps({ id: doc.id, ...doc.data() }) as WeatherForecast;
      });
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      throw error;
    }
  },
};
