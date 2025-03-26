
import { 
  mockSensorData, 
  mockDevices, 
  mockCrops, 
  mockWeatherForecast,
  generateHistoricalData,
  type SensorData,
  type Device,
  type Crop,
  type WeatherForecast
} from './mock-data';

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Sensor data
  getSensorData: async (): Promise<SensorData[]> => {
    await delay(800);
    return [...mockSensorData].map(sensor => ({
      ...sensor,
      value: sensor.value + (Math.random() * 2 - 1),
      timestamp: new Date().toISOString()
    }));
  },
  
  getSensorHistory: async (
    sensorId: string,
    period: "day" | "week" | "month" = "day"
  ) => {
    await delay(1000);
    
    const sensorType = sensorId.split('-')[0];
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
    
    const dataPoints = period === "day" ? 24 : period === "week" ? 7 : 30;
    return generateHistoricalData(dataType, dataPoints);
  },
  
  // Devices
  getDevices: async (): Promise<Device[]> => {
    await delay(600);
    return mockDevices;
  },
  
  updateDeviceStatus: async (deviceId: string, status: Device['status']): Promise<Device> => {
    await delay(500);
    const device = mockDevices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error(`Device with ID ${deviceId} not found`);
    }
    
    return {
      ...device,
      status,
      lastActive: new Date().toISOString()
    };
  },
  
  setFanSpeed: async (deviceId: string, speed: number): Promise<{ success: boolean }> => {
    await delay(700);
    // In a real app, this would send a command to the actual fan device
    return { success: true };
  },
  
  // Crops
  getCrops: async (): Promise<Crop[]> => {
    await delay(900);
    return mockCrops;
  },
  
  getCropById: async (cropId: string): Promise<Crop> => {
    await delay(500);
    const crop = mockCrops.find(c => c.id === cropId);
    if (!crop) {
      throw new Error(`Crop with ID ${cropId} not found`);
    }
    return crop;
  },
  
  // Weather
  getWeatherForecast: async (): Promise<WeatherForecast[]> => {
    await delay(1200);
    return mockWeatherForecast;
  },
};
