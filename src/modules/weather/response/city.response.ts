import { Expose } from 'class-transformer'

export class CityResponse {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  country: string

  @Expose()
  url: string
}
