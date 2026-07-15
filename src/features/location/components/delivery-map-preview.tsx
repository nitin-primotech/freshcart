import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { WebView, type WebView as WebViewType } from 'react-native-webview';

import { AppSymbol } from '@/shared/components/app-symbol';
import { hapticSoftTap } from '@/shared/haptics/feedback';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

type DeliveryMapPreviewProps = {
  latitude: number;
  longitude: number;
};

type MapStyle = 'streets' | 'satellite';

function buildLocationMapHtml(
  latitude: number,
  longitude: number,
  mapStyle: MapStyle,
): string {
  const tileUrl =
    mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution =
    mapStyle === 'satellite' ? 'Tiles © Esri' : '© OpenStreetMap';

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #eef2ee; }
    .leaflet-control-attribution { font-size: 7px !important; opacity: 0.65; }
    .leaflet-control-attribution a { color: #6b7280 !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    let mapStyle = '${mapStyle}';
    let center = [${latitude}, ${longitude}];

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: true,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      touchZoom: false,
    });

    let tileLayer = L.tileLayer('${tileUrl}', {
      maxZoom: 19,
      attribution: '${tileAttribution}',
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: '',
      html: '<div style="position:relative;width:36px;height:44px;display:flex;flex-direction:column;align-items:center;"><div style="width:34px;height:34px;border-radius:17px;background:#249B42;border:3px solid #fff;box-shadow:0 4px 14px rgba(36,155,66,0.45);display:flex;align-items:center;justify-content:center;"><div style="width:10px;height:10px;border-radius:5px;background:#fff;"></div></div><div style="width:8px;height:8px;border-radius:4px;background:#2563EB;margin-top:-2px;box-shadow:0 0 0 2px rgba(255,255,255,0.9);"></div></div>',
      iconSize: [36, 44],
      iconAnchor: [18, 40],
    });

    const marker = L.marker(center, { icon: pinIcon, zIndexOffset: 1000 }).addTo(map);
    map.setView(center, 15, { animate: false });

    window.updateMapCenter = function(lat, lng, nextStyle) {
      center = [lat, lng];
      marker.setLatLng(center);
      map.setView(center, map.getZoom() || 15, { animate: true, duration: 0.35 });

      if (nextStyle && nextStyle !== mapStyle) {
        mapStyle = nextStyle;
        map.removeLayer(tileLayer);
        const nextUrl = mapStyle === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const nextAttr = mapStyle === 'satellite' ? 'Tiles © Esri' : '© OpenStreetMap';
        tileLayer = L.tileLayer(nextUrl, { maxZoom: 19, attribution: nextAttr }).addTo(map);
      }
    };
  </script>
</body>
</html>`;
}

export function DeliveryMapPreview({
  latitude,
  longitude,
}: DeliveryMapPreviewProps) {
  const webViewRef = useRef<WebViewType>(null);
  const mapReadyRef = useRef(false);
  const initialCoordsRef = useRef({ latitude, longitude });
  const [mapStyle, setMapStyle] = useState<MapStyle>('streets');

  const mapHtml = useMemo(
    () =>
      buildLocationMapHtml(
        initialCoordsRef.current.latitude,
        initialCoordsRef.current.longitude,
        'streets',
      ),
    [],
  );

  useEffect(() => {
    if (!mapReadyRef.current) return;
    webViewRef.current?.injectJavaScript(`
      if (window.updateMapCenter) {
        window.updateMapCenter(${latitude}, ${longitude}, '${mapStyle}');
      }
      true;
    `);
  }, [latitude, longitude, mapStyle]);

  function toggleMapStyle() {
    hapticSoftTap();
    setMapStyle((current) => (current === 'streets' ? 'satellite' : 'streets'));
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onLoadEnd={() => {
          mapReadyRef.current = true;
          webViewRef.current?.injectJavaScript(`
            if (window.updateMapCenter) {
              window.updateMapCenter(${latitude}, ${longitude}, '${mapStyle}');
            }
            true;
          `);
        }}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      />

      <Pressable
        style={styles.mapToggle}
        onPress={toggleMapStyle}
        accessibilityRole="button"
        accessibilityLabel={
          mapStyle === 'streets'
            ? 'Switch to satellite view'
            : 'Switch to street view'
        }
      >
        <AppSymbol name="map.fill" size={16} tintColor={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
  },
  mapToggle: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(28, 28, 30, 0.14)',
  },
});
