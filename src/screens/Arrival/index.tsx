import { useRoute } from '@react-navigation/native'
import { X } from 'phosphor-react-native'

import { Header } from '../../components/Header'

import {
  Container,
  Content,
  Label,
  LicensePlate,
  Description,
  Footer,
} from './styles'
import { Button } from '../../components/Button'
import ButtonIcon from '../../components/ButtonIcon'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const route = useRoute()

  const { id } = route.params as RouteParamsProps

  return (
    <Container>
      <Header title="Chegada" />
      <Content>
        <Label>Placa do veículo</Label>
        <LicensePlate>XXX0000</LicensePlate>
        <Label>Finalidade</Label>
        <Description>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod vel
          quidem at sapiente placeat, vero voluptas autem dolorem distinctio aut
          possimus, libero rerum unde eius facilis aliquam aspernatur. Debitis,
          illum.
        </Description>
        <Footer>
          <ButtonIcon icon={X} />
          <Button title="Registrar Chegada" />
        </Footer>
      </Content>
    </Container>
  )
}
