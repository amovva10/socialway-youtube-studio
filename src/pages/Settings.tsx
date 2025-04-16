
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Moon, Lock, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    toast({
      title: "Notification Settings",
      description: notifications ? "Notifications disabled" : "Notifications enabled",
    });
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    toast({
      title: "Appearance",
      description: darkMode ? "Light mode enabled" : "Dark mode enabled",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="text-gray-600" />
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>
              <Switch 
                id="notifications"
                checked={notifications}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Moon className="text-gray-600" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="text-gray-600" />
                <Label>Manage Account</Label>
              </div>
              <Button variant="outline">
                Account Settings
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <Share2 className="text-gray-600" />
                <Label>Integrations</Label>
              </div>
              <Button variant="outline">
                Manage Connections
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
