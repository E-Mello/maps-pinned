// Path: /src/components/CustomMarker.tsx

import React from "react";
import { View, Image } from "react-native";

interface CustomMarkerProps {
  icon: any;
  size?: number;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ icon, size = 30 }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={icon}
        style={{
          width: size,
          height: size,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

export default CustomMarker;
