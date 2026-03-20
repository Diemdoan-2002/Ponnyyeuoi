import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import BabyScreen from '../screens/BabyScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import KnowledgeScreen from '../screens/KnowledgeScreen';
import MedsScreen from '../screens/MedsScreen';
import KickScreen from '../screens/KickScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatScreen';
import NutritionScreen from '../screens/NutritionScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NAV_ITEMS = [
  { name: 'Home', icon: require('../../assets/icons/nav-home.png'), label: 'Trang chủ' },
  { name: 'Baby', icon: require('../../assets/icons/nav-baby.png'), label: 'Bé yêu' },
  { name: 'Appointments', icon: require('../../assets/icons/nav-calendar.png'), label: 'Tái khám' },
  { name: 'Knowledge', icon: require('../../assets/icons/nav-book.png'), label: 'Kiến thức' },
  { name: 'Meds', icon: require('../../assets/icons/nav-pill.png'), label: 'Thuốc' },
  { name: 'Kick', icon: require('../../assets/icons/nav-kick.png'), label: 'Đếm đạp' },
  { name: 'Settings', icon: require('../../assets/icons/nav-settings.png'), label: 'Cài đặt' },
];

function CustomTabBar({ state, navigation }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.tabBarOuter, { backgroundColor: colors.surface }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarScroll}
      >
        {NAV_ITEMS.map((item, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.tabBtn}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              {/* Icon with rounded-rect highlight background when active */}
              <View style={[
                styles.iconContainer,
                isFocused && { backgroundColor: colors.primaryLighter },
              ]}>
                <Image
                  source={item.icon}
                  style={[styles.tabIcon, { opacity: isFocused ? 1 : 0.35 }]}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? colors.primary : '#999' },
                  isFocused && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Baby" component={BabyScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Knowledge" component={KnowledgeScreen} />
      <Tab.Screen name="Meds" component={MedsScreen} />
      <Tab.Screen name="Kick" component={KickScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Nutrition" component={NutritionScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    borderTopWidth: 0,
    paddingBottom: 24,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  tabBarScroll: {
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    minWidth: 64,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabIcon: {
    width: 52,
    height: 52,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    fontWeight: '800',
  },
});
