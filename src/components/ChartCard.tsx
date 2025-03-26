
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { SensorData } from "@/lib/mock-data";

interface ChartCardProps {
  sensor: SensorData;
  className?: string;
}

interface DataPoint {
  timestamp: string;
  value: number;
  unit: string;
}

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const ChartCard = ({ sensor, className }: ChartCardProps) => {
  const [period, setPeriod] = useState<"day" | "week" | "month">("day");
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSensorHistory(sensor.id, period);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [sensor.id, period]);

  const getLineColor = () => {
    switch (sensor.id.split("-")[0]) {
      case "temp":
        return "#ef4444";
      case "humidity":
        return "#0ea5e9";
      case "co2":
        return "#10b981";
      case "airflow":
        return "#6366f1";
      default:
        return "#6366f1";
    }
  };

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (period === "day") {
      return timeFormatter.format(date);
    }
    return dateFormatter.format(date);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm p-2 border rounded-md shadow-md text-xs">
          <p className="font-medium">{new Date(data.timestamp).toLocaleString()}</p>
          <p className="text-foreground">
            {data.value} {data.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{sensor.name} History</CardTitle>
            <CardDescription>Historical readings over time</CardDescription>
          </div>
          <Tabs defaultValue="day" value={period} onValueChange={(v) => setPeriod(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="day" className="text-xs px-2">24h</TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-2">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse-subtle">Loading chart data...</div>
          </div>
        ) : (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={formatXAxis}
                  minTickGap={15}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  width={30}
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getLineColor()}
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ r: 4 }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
