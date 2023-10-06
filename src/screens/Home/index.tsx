import { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useRealm } from '../../libs/realm'
import { useQuery } from '../../libs/realm'
import { Historic } from '../../libs/realm/schemas/Historic'

import { HomeHeader } from '../../components/HomeHeader'
import { CarStatus } from '../../components/CarStatus'

import { Container, Content } from './styles'
import { Alert } from 'react-native'
import { HistoricCard } from '../../components/HistoricCard'

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
  const { navigate } = useNavigation()

  const realm = useRealm()
  const historic = useQuery(Historic)

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigate('arrival', { id: vehicleInUse?._id.toString() })
    } else {
      navigate('departure')
    }
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0]
      setVehicleInUse(vehicle)
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Veículo em uso',
        'Não foi possível carregar o veículo em uso.'
      )
    }
  }

  function fetchHistoric() {
    const response = historic.filtered(
      "status = 'arrival' SORT(created_at DESC)"
    )
    console.log('Historico', response)
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())
    return () => realm.removeListener('change', fetchVehicleInUse)
  }, [])

  useEffect(() => {
    fetchHistoric()
  }, [historic])

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <HistoricCard
          data={{ created: '06/10', licensePlate: 'AAA8888', isSync: false }}
        />
      </Content>
    </Container>
  )
}
