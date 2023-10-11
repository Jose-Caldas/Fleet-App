import React from 'react'

import { IconBox } from '../IconBox'
import { IconBoxProps } from '../ButtonIcon'

import { Container, Description, Info, Label } from './styles'

export type LocationInfoProps = {
  label: string
  description: string | null
}

type Props = LocationInfoProps & {
  icon: IconBoxProps
}

export function LocationInfo({ label, description, icon }: Props) {
  return (
    <Container>
      <IconBox icon={icon} />
      <Info>
        <Label numberOfLines={1}>{label}</Label>
        <Description numberOfLines={1}>{description}</Description>
      </Info>
    </Container>
  )
}
