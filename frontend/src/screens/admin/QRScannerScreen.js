import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { scanAndMarkAttendance } from "../../services/registrationService";

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned || processing) return;
    setScanned(true);
    setProcessing(true);

    try {
      await scanAndMarkAttendance(data);
      Alert.alert("Success", "Attendance marked as Present.", [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
            setProcessing(false);
          },
        },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Could not mark attendance. Please try again.",
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
              setProcessing(false);
            },
          },
        ]
      );
    }
  };

  if (!permission) {
    return <View style={styles.centered} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera access is needed to scan QR codes.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Scan Volunteer QR Code</Text>
      </View>

      <View style={styles.scanBox} />

      {processing && (
        <View style={styles.processingOverlay}>
          <Text style={styles.processingText}>Marking attendance...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#FFFFFF" },
  permissionText: { fontSize: 15, color: "#374151", textAlign: "center", marginBottom: 20 },
  permissionButton: {
    backgroundColor: "#2E5395",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  permissionButtonText: { color: "#FFFFFF", fontWeight: "600" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(46, 83, 149, 0.9)",
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: { marginRight: 12 },
  topBarTitle: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  scanBox: {
    position: "absolute",
    top: "35%",
    left: "15%",
    width: "70%",
    height: "30%",
    borderWidth: 3,
    borderColor: "#F5A623",
    borderRadius: 16,
  },
  processingOverlay: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  processingText: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
  },
});