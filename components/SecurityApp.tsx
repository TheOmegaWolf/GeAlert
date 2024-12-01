import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ButtonState = "armed" | "disarmed" | "active" | "inactive";
type LocationStatus = "home" | "away";

const SecurityApp: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<ButtonState>("disarmed");
  const [cameraStatus, setCameraStatus] = useState<ButtonState>("inactive");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("home");
  const [locationDebug, setLocationDebug] = useState<string>("Location not tracked");
  const [simulatedLocation, setSimulatedLocation] = useState<{ lat: number; lon: number }>({ lat: 37.7749, lon: -122.4194 });

  // Simulated home location
  const HOME_LOCATION = { lat: 37.7749, lon: -122.4194 };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  useEffect(() => {
    const distance = calculateDistance(HOME_LOCATION.lat, HOME_LOCATION.lon, simulatedLocation.lat, simulatedLocation.lon);
    if (distance > 0.1 && systemStatus !== "armed") {
      Alert.alert("Security Alert", "You are away from home. Remember to arm your security system!");
    }
  }, [simulatedLocation, systemStatus]);

  const handleSystemToggle = () => {
    setSystemStatus((prevState) => (prevState === "armed" ? "disarmed" : "armed"));
  };

  const handleCameraToggle = () => {
    setCameraStatus((prevStatus) => (prevStatus === "inactive" ? "active" : "inactive"));
  };

  const handleEmergency = () => {
    Alert.alert("Emergency Alert", "Emergency services have been notified. Police, Fire, and Medical services are on their way.", [{ text: "OK" }]);
  };

  const simulateLocationChange = (locationType: "home" | "away") => {
    if (locationType === "home") {
      setSimulatedLocation(HOME_LOCATION);
      setLocationStatus("home");
      setLocationDebug(`Home Location: Lat ${HOME_LOCATION.lat}, Lon ${HOME_LOCATION.lon}`);
    } else {
      const awayLocation = { lat: HOME_LOCATION.lat + 0.05, lon: HOME_LOCATION.lon + 0.05 };
      setSimulatedLocation(awayLocation);
      setLocationStatus("away");
      setLocationDebug(`Away Location: Lat ${awayLocation.lat}, Lon ${awayLocation.lon}`);
    }
  };

  const simulateBreakIn = () => {
    Alert.alert("Break-In Detected!", "Security breach identified. Emergency services are being contacted automatically.", [{ text: "OK" }]);
  };

  const simulateSensorTrigger = () => {
    Alert.alert("Sensor Triggered", "Motion detected near the front door. Checking camera feed.", [{ text: "OK" }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <MaterialIcons name="security" size={40} color="#fff" />
          <Text style={styles.title}>Security System</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusCard}>
            <MaterialIcons name={systemStatus === "armed" ? "lock" : "lock-open"} size={24} color={systemStatus === "armed" ? "#ff4d4d" : "#4caf50"} />
            <Text style={styles.statusCardText}>System Status: {systemStatus.toUpperCase()}</Text>
          </View>

          <View style={styles.statusCard}>
            <MaterialIcons name={cameraStatus === "active" ? "videocam" : "videocam-off"} size={24} color={cameraStatus === "active" ? "#2196f3" : "#b0bec5"} />
            <Text style={styles.statusCardText}>Camera Status: {cameraStatus.toUpperCase()}</Text>
          </View>

          <View style={styles.statusCard}>
            <MaterialIcons name="location-on" size={24} color={locationStatus === "home" ? "#4caf50" : "#ff4d4d"} />
            <Text style={styles.statusCardText}>Location: {locationStatus.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.systemButton, systemStatus === "armed" ? styles.buttonArmed : styles.buttonDisarmed]}
            onPress={handleSystemToggle}
          >
            <MaterialIcons name={systemStatus === "armed" ? "lock" : "lock-open"} size={24} color="#fff" />
            <Text style={styles.buttonText}>{systemStatus === "armed" ? "Disarm System" : "Arm System"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.systemButton, cameraStatus === "active" ? styles.buttonActive : styles.buttonInactive]}
            onPress={handleCameraToggle}
          >
            <MaterialIcons name={cameraStatus === "active" ? "videocam" : "videocam-off"} size={24} color="#fff" />
            <Text style={styles.buttonText}>{cameraStatus === "active" ? "Deactivate Camera" : "Activate Camera"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
          <MaterialIcons name="warning" size={24} color="#fff" />
          <Text style={styles.emergencyButtonText}>EMERGENCY ALERT</Text>
        </TouchableOpacity>

        <View style={styles.utilityContainer}>
          <Text style={styles.locationDebugText}>Location Debug: {locationDebug}</Text>

          <View style={styles.simulationButtonContainer}>
            <TouchableOpacity style={styles.simulationButton} onPress={() => simulateLocationChange("home")}>
              <MaterialIcons name="home" size={20} color="#fff" />
              <Text style={styles.simulationButtonText}>Simulate Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simulationButton} onPress={() => simulateLocationChange("away")}>
              <MaterialIcons name="directions-walk" size={20} color="#fff" />
              <Text style={styles.simulationButtonText}>Simulate Away</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.simulationButtonContainer}>
            <TouchableOpacity style={styles.simulationButton} onPress={simulateBreakIn}>
              <MaterialIcons name="warning" size={20} color="#fff" />
              <Text style={styles.simulationButtonText}>Simulate Break-In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.simulationButton} onPress={simulateSensorTrigger}>
              <MaterialIcons name="sensors" size={20} color="#fff" />
              <Text style={styles.simulationButtonText}>Simulate Sensor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1a1a2e",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#16213e",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#fff",
  },
  statusContainer: {
    width: "100%",
    marginBottom: 20,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16213e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusCardText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 15,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    marginVertical: 20,
  },
  systemButton: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  buttonArmed: {
    backgroundColor: "#ff4d4d",
  },
  buttonDisarmed: {
    backgroundColor: "#4caf50",
  },
  buttonActive: {
    backgroundColor: "#2196f3",
  },
  buttonInactive: {
    backgroundColor: "#b0bec5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  emergencyButton: {
    flexDirection: "row",
    backgroundColor: "#d32f2f",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  utilityContainer: {
    marginTop: 20,
    width: "100%",
  },
  locationDebugText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  simulationButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  simulationButton: {
    backgroundColor: "#607d8b",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    justifyContent: "center",
  },
  simulationButtonText: {
    color: "#fff",
    marginLeft: 5,
  },
});

export default SecurityApp;