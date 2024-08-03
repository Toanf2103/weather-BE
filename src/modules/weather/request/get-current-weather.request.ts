import { IsNotEmpty, IsString } from 'class-validator'

export class GetCurrentWeatherRequest {
  @IsString()
  @IsNotEmpty()
  q: string
}
