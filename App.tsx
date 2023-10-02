import { ThemeProvider } from 'styled-components/native'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { AppProvider, UserProvider } from '@realm/react'
import { REALM_APP_ID } from '@env'

import { Signin } from './src/screens/Signin'
import theme from './src/theme'
import { Loading } from './src/components/Loading'
import { StatusBar } from 'react-native'
import { Routes } from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  if (!fontsLoaded) {
    return <Loading />
  }
  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <UserProvider fallback={Signin}>
          <Routes />
        </UserProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
