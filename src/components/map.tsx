import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

export interface IMapProps {}

const Map: React.FC<IMapProps> = () => {
  const mapRef = useRef<ReactMapGL | null>(null);
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 52.51126239232381,
    longitude: 13.288278216771987,
    zoom: 10,
  });

  return (
    <div className="text-black relative">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="calc(100vh - 64px)"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        ref={(instance) => (mapRef.current = instance)} //store this instance of this map on the ref
        minZoom={8}
        maxZoom={16}
        mapStyle="mapbox://styles/jeffemerald/ckq28ecdq1lfr17p9bwdsbhcu"
        // mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef
      />
    </div>
  );
};

export default Map;
