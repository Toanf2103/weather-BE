import { Controller, Get, HttpCode, HttpStatus, Ip, Query, Req } from '@nestjs/common'
import { WeatherService } from './weather.service'
import { FindCitiesRequest, GetCurrentWeatherRequest, GetForeCastWeatherRequest } from './request'
import { CityResponse, CurrentWeatherResponse } from './response'
import { Request } from 'express'
import { GetCurrentIpWeatherRequest } from './request/get-current-ip-weather.request'

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/find-cities')
  @HttpCode(HttpStatus.OK)
  async findCities(@Query() findCityRequest: FindCitiesRequest): Promise<CityResponse[]> {
    return await this.weatherService.findCities(findCityRequest)
  }

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  async getCurrentWeather(
    @Query() getCurrentWeatherRequest: GetCurrentWeatherRequest,
  ): Promise<CurrentWeatherResponse> {
    return await this.weatherService.getCurrentWeather(getCurrentWeatherRequest)
  }

  @Get('/current-ip')
  @HttpCode(HttpStatus.OK)
  async getCurrentIpWeather(
    @Query() getCurrentIpWeatherRequest: GetCurrentIpWeatherRequest,
  ): Promise<CurrentWeatherResponse> {
    return await this.weatherService.getCurrentIpWeather(getCurrentIpWeatherRequest)
  }

  @Get('/forecast')
  @HttpCode(HttpStatus.OK)
  async getForecastWeather(
    @Query() getForeCastWeatherRequest: GetForeCastWeatherRequest,
  ): Promise<CurrentWeatherResponse> {
    return await this.weatherService.getForecastWeather(getForeCastWeatherRequest)
  }
}
