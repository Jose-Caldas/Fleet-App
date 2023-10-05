import { Key, Car } from 'phosphor-react-native'
import { TouchableOpacityProps } from 'react-native'

import { Container, IconBox, Message, TextHighLight } from './styles'
import { useTheme } from 'styled-components'

type Props = TouchableOpacityProps & {
  licensePlate?: string | null
}

export function CarStatus({ licensePlate = null, ...rest }: Props) {
  const Icon = licensePlate ? Car : Key
  const message = licensePlate
    ? `Veículo ${licensePlate} em uso. `
    : `Nenhum veículo em uso. `
  const status = licensePlate ? 'chegada' : 'saída'

  const theme = useTheme()

  return (
    <Container {...rest}>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message>
        {message}
        <TextHighLight>Clique aqui para registrar a {status}</TextHighLight>
      </Message>
    </Container>
  )
}
