import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type CircularButtonProps = {
  size?: number;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function CircularButton({
  size = 56,
  onPress,
  disabled,
  loading,
  accessibilityLabel,
  children,
  style,
}: CircularButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.btn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.surfaceMuted,
          borderColor: theme.border,
        },
        pressed && { opacity: 0.6 },
        (disabled || loading) && { opacity: 0.45 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
