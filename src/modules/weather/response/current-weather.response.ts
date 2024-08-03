import { Expose, plainToInstance, Transform } from 'class-transformer'

class CurrentWeatherLocation {
  @Expose()
  name: string

  @Expose()
  country: string

  @Expose()
  localtime: string
}

class CurrentWeatherDataCondition {
  @Expose()
  text: string

  @Expose()
  icon: string
}

class CurrentWeatherData {
  @Expose()
  temp_c: string

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(CurrentWeatherDataCondition, obj.condition, { excludeExtraneousValues: true }),
  )
  condition: CurrentWeatherDataCondition

  @Expose()
  wind_mph: number

  @Expose()
  humidity: number
}

export class CurrentWeatherResponse {
  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(CurrentWeatherLocation, obj.location, { excludeExtraneousValues: true }),
  )
  location: CurrentWeatherLocation

  @Expose()
  @Transform(({ obj }) =>
    plainToInstance(CurrentWeatherData, obj.current, { excludeExtraneousValues: true }),
  )
  current: CurrentWeatherData
}
