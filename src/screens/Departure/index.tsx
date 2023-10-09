import { useEffect, useRef, useState } from 'react'
import { ScrollView, TextInput, Alert } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import {
  useForegroundPermissions,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
} from 'expo-location'

import { useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { useUser } from '@realm/react'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { licensePlateValidate } from '../../utils/licensePlateValidate'

import { Container, Content, Message } from './styles'

export function Departure() {
  const [description, setDescription] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions()

  const { goBack } = useNavigation()
  const realm = useRealm()
  const user = useUser()

  const descriptionRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'A placa é inválida. Por favor, informe a placa correta do veículo.'
        )
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, informe a finalidade da utilização do veículo.'
        )
      }
      setIsRegistering(true)

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        )
      })

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso!')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possível registrar a saída do veículo.')
      setIsRegistering(false)
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission()
  }, [])

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return
    }

    let subscription: LocationSubscription
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        console.log('localização', location)
      }
    ).then((response) => (subscription = response))

    return () => subscription?.remove()
  }, [locationForegroundPermission])

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          utilizar essa funcionalidade. Por favor acesse as configurações do seu
          dispostivo para conceder essa permissão ao aplicativo.
        </Message>
      </Container>
    )
  }

  return (
    <Container>
      <Header title="Saída" />
      <KeyboardAwareScrollView extraHeight={200}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />
            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
