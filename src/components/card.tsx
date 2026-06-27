import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { CardMaxWidth, Spacing } from '@/constants/theme';

export function Card({ style, children, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: CardMaxWidth,
    alignSelf: 'center',
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
