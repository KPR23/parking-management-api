import { NativeTabs } from 'expo-router/native-tabs';

export default function RootLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Parkings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'parkingsign', selected: 'parkingsign' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="reservations">
        <NativeTabs.Trigger.Label>Passes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'wallet.pass', selected: 'wallet.pass.fill' }}
        />
      </NativeTabs.Trigger>

      {/* <NativeTabs.Trigger name="cars">
        <NativeTabs.Trigger.Label>Cars</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'car', selected: 'car.fill' }}
        />
      </NativeTabs.Trigger> */}

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: 'person.crop.circle',
            selected: 'person.crop.circle.fill',
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
