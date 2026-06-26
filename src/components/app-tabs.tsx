import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs backgroundColor="#000" indicatorColor="#333">
      <NativeTabs.Trigger name="index">
        <Label>Volume</Label>
        <Icon sf="speaker.wave.2.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="player">
        <Label>Player</Label>
        <Icon sf="play.circle.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gearshape.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
