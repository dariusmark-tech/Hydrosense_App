// ============================================================
//  HydroSense — App Navigator  (Light Green Theme)
//  File: src/navigation/AppNavigator.js
// ============================================================
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { COLORS } from '../utils/theme';

import DashboardScreen  from '../screens/DashboardScreen';
import MonitoringScreen from '../screens/MonitoringScreen';
import CameraScreen     from '../screens/CameraScreen';
import LogsScreen       from '../screens/LogsScreen';
import HealthScreen     from '../screens/HealthScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Dashboard',  component: DashboardScreen,  icon: '🏠', label: 'Dashboard' },
  { name: 'Monitoring', component: MonitoringScreen, icon: '📊', label: 'Monitor'   },
  { name: 'Camera',     component: CameraScreen,     icon: '📷', label: 'Camera'    },
  { name: 'Logs',       component: LogsScreen,       icon: '📋', label: 'Logs'      },
  { name: 'Health',     component: HealthScreen,     icon: '💊', label: 'Health'    },
];

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.bgCard,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 6,
            height: 60,
            shadowColor: '#1e7a45',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          },
          tabBarActiveTintColor:   COLORS.greenDark,
          tabBarInactiveTintColor: COLORS.textFaint,
          tabBarLabelStyle: { fontSize: 9, fontWeight: '700', marginTop: 0 },
          tabBarIcon: ({ focused }) => {
            const tab = TABS.find(t => t.name === route.name);
            return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{tab?.icon}</Text>;
          },
        })}
      >
        {TABS.map(t => (
          <Tab.Screen key={t.name} name={t.name} component={t.component} options={{ tabBarLabel: t.label }} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
