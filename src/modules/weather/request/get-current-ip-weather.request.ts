import { IsNotEmpty, IsString } from 'class-validator'

export class GetCurrentIpWeatherRequest {
  @IsString()
  @IsNotEmpty()
  ip: string
}
