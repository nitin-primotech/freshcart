import { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebView as WebViewType } from 'react-native-webview';

import { RESTAURANT_COORDS } from '@/lib/firebase/order-mapper';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { fonts } from '@/theme/typography';

type RiderLiveMapProps = {
  deliveryCoords: [number, number];
  riderCoords: [number, number];
  status: 'preparing' | 'ready' | 'on_the_way';
};

function buildLeafletMapHtml(
  restaurant: [number, number],
  delivery: [number, number],
  rider: [number, number],
): string {
  const points = [restaurant, delivery, rider];
  const lats = points.map((point) => point[0]);
  const lngs = points.map((point) => point[1]);
  const minLat = Math.min(...lats) - 0.004;
  const maxLat = Math.max(...lats) + 0.004;
  const minLng = Math.min(...lngs) - 0.004;
  const maxLng = Math.max(...lngs) + 0.004;

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #f3f4f6; }
    .leaflet-control-attribution { font-size: 8px !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const restaurant = [${restaurant[0]}, ${restaurant[1]}];
    const delivery = [${delivery[0]}, ${delivery[1]}];
    let rider = [${rider[0]}, ${rider[1]}];

    const map = L.map('map', { zoomControl: false, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const restaurantIcon = L.divIcon({
      className: '',
      html: '<div style="width:28px;height:28px;border-radius:14px;background:#2D6A4F;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;">🍽</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const riderIcon = L.divIcon({
      className: '',
      html: '<div id="rider-pin" style="width:32px;height:32px;border-radius:16px;background:#D4543C;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(212,84,60,0.45);transition:transform 0.8s ease;">🛵</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const homeIcon = L.divIcon({
      className: '',
      html: '<div style="width:28px;height:28px;border-radius:14px;background:#2563EB;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;">🏠</div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker(restaurant, { icon: restaurantIcon }).addTo(map);
    const riderMarker = L.marker(rider, { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
    L.marker(delivery, { icon: homeIcon }).addTo(map);

    let routeLine = L.polyline([rider, delivery], {
      color: '#D4543C',
      weight: 4,
      opacity: 0.75,
      dashArray: '8 8',
    }).addTo(map);

    map.fitBounds([[${minLat}, ${minLng}], [${maxLat}, ${maxLng}]], { padding: [28, 28] });

    window.updateRiderPosition = function(lat, lng) {
      rider = [lat, lng];
      riderMarker.setLatLng(rider);
      routeLine.setLatLngs([rider, delivery]);
      const pin = document.getElementById('rider-pin');
      if (pin) {
        pin.style.transform = 'scale(1.12)';
        setTimeout(function() { pin.style.transform = 'scale(1)'; }, 300);
      }
      map.panTo(rider, { animate: true, duration: 0.8 });
    };
  </script>
</body>
</html>`;
}

const STATUS_LABELS: Record<RiderLiveMapProps['status'], string> = {
  preparing: 'Rider heading to restaurant',
  ready: 'Rider at restaurant',
  on_the_way: 'Rider is on the way to you',
};

export function RiderLiveMap({
  deliveryCoords,
  riderCoords,
  status,
}: RiderLiveMapProps) {
  const webViewRef = useRef<WebViewType>(null);
  const mapReadyRef = useRef(false);
  const initialRiderCoordsRef = useRef(riderCoords);
  const mapHtml = useMemo(
    () =>
      buildLeafletMapHtml(
        RESTAURANT_COORDS,
        deliveryCoords,
        initialRiderCoordsRef.current,
      ),
    [deliveryCoords],
  );

  useEffect(() => {
    if (!mapReadyRef.current) return;
    webViewRef.current?.injectJavaScript(`
      if (window.updateRiderPosition) {
        window.updateRiderPosition(${riderCoords[0]}, ${riderCoords[1]});
      }
      true;
    `);
  }, [riderCoords]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Live tracking</Text>
          <Text style={styles.subtitle}>{STATUS_LABELS[status]}</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={styles.map}
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          onLoadEnd={() => {
            mapReadyRef.current = true;
            webViewRef.current?.injectJavaScript(`
              if (window.updateRiderPosition) {
                window.updateRiderPosition(${riderCoords[0]}, ${riderCoords[1]});
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(36, 155, 66, 0.12)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D6A4F',
  },
  liveText: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    lineHeight: 12,
    color: '#2D6A4F',
  },
  mapWrap: {
    height: 240,
    borderRadius: 12,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundMuted,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMuted,
  },
});
