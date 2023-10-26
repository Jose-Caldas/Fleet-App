import { Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { X } from 'phosphor-react-native'
import { BSON } from 'realm'

import { useObject, useRealm } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'
import { getLastAsyncTimestamp } from '../../libs/asyncStorage'

import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import ButtonIcon from '../../components/ButtonIcon'
import { stopLocationTask } from '../../tasks/backgroundLocationTask'
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage'

import {
  Container,
  Content,
  Label,
  LicensePlate,
  Description,
  Footer,
  AsyncMessage,
} from './styles'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)

  const route = useRoute()
  const realm = useRealm()
  const { goBack } = useNavigation()

  const { id } = route.params as RouteParamsProps

  const historic = useObject(Historic, new BSON.UUID(id) as unknown as string)

  const toggleTitle = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeVehicleUsage() },
    ])
  }

  function removeVehicleUsage() {
    realm.write(() => {
      realm.delete(historic)
    })
    goBack()
  }

  async function handleArrivalRegister() {
    try {
      if (!historic) {
        Alert.alert(
          'Error',
          'Não foi possível obter os dados para registrar a chegada do veículo!'
        )
      }

      await stopLocationTask()

      realm.write(() => {
        if (historic) {
          historic.status = 'arrival'
          historic.updated_at = new Date()
        }
      })

      Alert.alert('Chegada', 'Chegada registrada com sucesso!')
      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Error', 'Não foi possível registrar a chegada do veículo!')
    }
  }

  async function getLocationsInfo() {
    const lastSync = await getLastAsyncTimestamp()
    const updatedAt = historic?.updated_at.getTime()

    if (updatedAt && lastSync) {
      setDataNotSynced(updatedAt > lastSync)
    }

    const locationsStorage = await getStorageLocations()
    console.log('STORAGE => ', locationsStorage)
  }

  useEffect(() => {
    getLocationsInfo()
  }, [historic])

  return (
    <Container>
      <Header title={toggleTitle} />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>{historic?.license_plate}</LicensePlate>
        <Label>Finalidade</Label>
        <Description>{historic?.description}</Description>
      </Content>
      {historic?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Registrar Chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da{' '}
          {historic?.status === 'departure' ? 'partida ' : 'chegada'} pendente.
        </AsyncMessage>
      )}
    </Container>
  )
}
