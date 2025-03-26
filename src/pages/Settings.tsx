
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { BellRing, Mail, Shield, Smartphone, Gauge, User, Wifi } from "lucide-react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    alertThreshold: "warning",
  });
  
  const [deviceSettings, setDeviceSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    dataLogging: true,
    energySaving: true,
  });
  
  const saveSettings = (settingType: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${settingType} settings saved successfully`);
    }, 1000);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-light">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <BellRing className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex gap-2 items-center">
            <Smartphone className="h-4 w-4" />
            <span>Devices</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              
              <Button onClick={() => saveSettings('Profile')}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Secure your account with two-factor authentication
                  </p>
                </div>
                <Switch id="two-factor" defaultChecked />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              
              <Button variant="outline" onClick={() => saveSettings('Security')}>
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you would like to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                </div>
                <Switch
                  id="email-alerts"
                  checked={notificationSettings.emailAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                </div>
                <Switch
                  id="sms-alerts"
                  checked={notificationSettings.smsAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsAlerts: checked }))}
                />
              </div>
              
              <div>
                <Label htmlFor="alert-threshold" className="mb-2 block">Alert Threshold</Label>
                <select
                  id="alert-threshold"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={notificationSettings.alertThreshold}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, alertThreshold: e.target.value }))}
                >
                  <option value="critical">Critical issues only</option>
                  <option value="warning">Warning and critical issues</option>
                  <option value="info">All notifications (info, warning, critical)</option>
                </select>
              </div>
              
              <Button 
                onClick={() => saveSettings('Notification')}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Configuration</CardTitle>
              <CardDescription>
                Configure hardware and connectivity settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <Label htmlFor="auto-connect">Auto Connect</Label>
                </div>
                <Switch
                  id="auto-connect"
                  defaultChecked
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="refresh-interval">Data Refresh Interval (seconds)</Label>
                  <span>{deviceSettings.refreshInterval}s</span>
                </div>
                <Slider
                  id="refresh-interval"
                  min={5}
                  max={60}
                  step={5}
                  value={[deviceSettings.refreshInterval]}
                  onValueChange={(value) => setDeviceSettings(prev => ({ ...prev, refreshInterval: value[0] }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <Label htmlFor="data-logging">Data Logging</Label>
                </div>
                <Switch
                  id="data-logging"
                  checked={deviceSettings.dataLogging}
                  onCheckedChange={(checked) => setDeviceSettings(prev => ({ ...prev, dataLogging: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <Label htmlFor="energy-saving">Energy Saving Mode</Label>
                </div>
                <Switch
                  id="energy-saving"
                  checked={deviceSettings.energySaving}
                  onCheckedChange={(checked) => setDeviceSettings(prev => ({ ...prev, energySaving: checked }))}
                />
              </div>
              
              <Button 
                onClick={() => saveSettings('Device')}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Configuration"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>
                Manage your connected sensors and controllers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium text-sm">Main Ventilation Fan</h3>
                    <p className="text-xs text-muted-foreground">Last connected: Today, 10:23 AM</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium text-sm">Secondary Fan</h3>
                    <p className="text-xs text-muted-foreground">Last connected: Today, 10:24 AM</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h3 className="font-medium text-sm">Environment Sensor 1</h3>
                    <p className="text-xs text-muted-foreground">Last connected: Today, 10:20 AM</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-sm">Environment Sensor 2</h3>
                    <p className="text-xs text-muted-foreground">Last connected: Today, 10:22 AM</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4 w-full">
                Add New Device
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
