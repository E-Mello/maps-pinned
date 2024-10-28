// Path: /src/screens/MapScreen.tsx

import React, { useState, useEffect } from "react";
import { View, Modal, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Linking from "expo-linking";
import { PINS } from "../utils/pins";
import { styles } from "./mapscreen.styles";
import CustomMarker from "../components/CustomMarker";

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState<(typeof PINS)[0] | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleGoogleMapsRedirect = () => {
    if (selectedPin) {
      Linking.openURL(selectedPin.mapLink);
    }
  };

  const openModal = (pin: (typeof PINS)[0]) => {
    setSelectedPin(pin);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: PINS[0].coordinates.latitude,
          longitude: PINS[0].coordinates.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {PINS.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coordinates}
            title={pin.title}
            description={pin.description}
            pinColor={pin.icon ? undefined : pin.pinColor} // Usa pinColor apenas se icon não estiver definido
            onPress={() => openModal(pin)}
          >
            {pin.icon && <CustomMarker icon={pin.icon} size={25} />}
          </Marker>
        ))}
      </MapView>

      {/* Modal para informações adicionais */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedPin && (
            <>
              <Text style={styles.modalTitle}>{selectedPin.title}</Text>
              <Text style={styles.modalSubtitle}>
                {selectedPin.description}
              </Text>

              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{selectedPin.address}</Text>
                {selectedPin.contact ? (
                  <Text style={styles.infoText}>{selectedPin.contact}</Text>
                ) : null}
                <Text style={styles.infoText}>{selectedPin.website}</Text>
                <Text style={styles.infoText}>{selectedPin.hours}</Text>
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.navigateButton}
            onPress={handleGoogleMapsRedirect}
          >
            <Text style={styles.navigateButtonText}>Ir até o local</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;
