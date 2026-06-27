import { StyleSheet, View } from 'react-native';

type IconProps = {
  size?: number;
  color: string;
};

export function PlayIcon({ size = 20, color }: IconProps) {
  const s = size;
  return (
    <View
      style={{
        width: s,
        height: s,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: s * 0.32,
          borderBottomWidth: s * 0.32,
          borderLeftWidth: s * 0.52,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: color,
          marginLeft: s * 0.1,
        }}
      />
    </View>
  );
}

export function PauseIcon({ size = 20, color }: IconProps) {
  const barW = size * 0.18;
  const barH = size * 0.6;
  return (
    <View style={[styles.iconWrap, { width: size, height: size, flexDirection: 'row', gap: size * 0.14 }]}>
      <View style={{ width: barW, height: barH, backgroundColor: color, borderRadius: barW * 0.25 }} />
      <View style={{ width: barW, height: barH, backgroundColor: color, borderRadius: barW * 0.25 }} />
    </View>
  );
}

export function StopIcon({ size = 20, color }: IconProps) {
  const s = size * 0.55;
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <View style={{ width: s, height: s, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

export function SpeakerIcon({ size = 24, color }: IconProps) {
  const bodyW = size * 0.32;
  const bodyH = size * 0.42;
  const coneW = size * 0.22;
  return (
    <View style={[styles.iconWrap, { width: size, height: size, flexDirection: 'row' }]}>
      <View
        style={{
          width: bodyW,
          height: bodyH,
          backgroundColor: color,
          borderTopLeftRadius: 2,
          borderBottomLeftRadius: 2,
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderTopWidth: size * 0.36,
          borderBottomWidth: size * 0.36,
          borderLeftWidth: coneW,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: color,
          marginLeft: -1,
        }}
      />
      <View
        style={{
          width: size * 0.06,
          height: size * 0.4,
          borderRadius: size * 0.03,
          backgroundColor: color,
          marginLeft: size * 0.08,
          alignSelf: 'center',
        }}
      />
      <View
        style={{
          width: size * 0.06,
          height: size * 0.6,
          borderRadius: size * 0.03,
          backgroundColor: color,
          marginLeft: size * 0.06,
          alignSelf: 'center',
        }}
      />
    </View>
  );
}

export function GearIcon({ size = 24, color }: IconProps) {
  const ring = size * 0.78;
  const ringBorder = Math.max(2, size * 0.12);
  const innerHole = ring - ringBorder * 2;
  const tooth = size * 0.16;
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      <View
        style={{
          width: ring,
          height: ring,
          borderRadius: ring / 2,
          borderWidth: ringBorder,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: innerHole * 0.45,
            height: innerHole * 0.45,
            borderRadius: innerHole,
            backgroundColor: color,
          }}
        />
      </View>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <View
          key={deg}
          style={{
            position: 'absolute',
            width: tooth * 0.6,
            height: tooth,
            backgroundColor: color,
            borderRadius: 1,
            transform: [
              { rotate: `${deg}deg` },
              { translateY: -(ring / 2 + tooth * 0.35) },
            ],
          }}
        />
      ))}
    </View>
  );
}

type MoonProps = IconProps & { cutoutColor: string };

export function MoonIcon({ size = 22, color, cutoutColor }: MoonProps) {
  const d = size * 0.86;
  return (
    <View style={[styles.iconWrap, { width: size, height: size, overflow: 'hidden' }]}>
      <View
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: d * 0.92,
          height: d * 0.92,
          borderRadius: d,
          backgroundColor: cutoutColor,
          left: size * 0.18,
          top: -size * 0.05,
        }}
      />
    </View>
  );
}

export function SunIcon({ size = 22, color }: IconProps) {
  const core = size * 0.42;
  const rayLen = size * 0.18;
  const rayThick = size * 0.07;
  return (
    <View style={[styles.iconWrap, { width: size, height: size }]}>
      {[0, 45, 90, 135].map((deg) => (
        <View
          key={deg}
          style={{
            position: 'absolute',
            width: size,
            height: rayThick,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            transform: [{ rotate: `${deg}deg` }],
          }}
        >
          <View style={{ width: rayLen, height: rayThick, backgroundColor: color, borderRadius: rayThick / 2 }} />
          <View style={{ width: rayLen, height: rayThick, backgroundColor: color, borderRadius: rayThick / 2 }} />
        </View>
      ))}
      <View
        style={{
          width: core,
          height: core,
          borderRadius: core / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
