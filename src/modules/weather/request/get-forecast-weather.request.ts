import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class GetForeCastWeatherRequest {
  @IsString()
  @IsNotEmpty()
  q: string

  @IsNotEmpty()
  page: number

  @IsNotEmpty()
  perPage: number
}
