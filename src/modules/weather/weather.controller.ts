import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { WeatherService } from './weather.service'
import {
  FindCitiesRequest,
  GetCurrentWeatherRequest,
  GetForeCastWeatherRequest,
  RegisterNotificationsRequest,
} from './request'
import { CityResponse, CurrentWeatherResponse } from './response'
import { Request, Response } from 'express'
import { GetCurrentIpWeatherRequest } from './request/get-current-ip-weather.request'
import { ConfigService } from '@nestjs/config'

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly configSer: ConfigService,
  ) {}

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

  @Post('/register-notifications')
  @HttpCode(HttpStatus.OK)
  async registerNotifications(@Body() rq: RegisterNotificationsRequest) {
    return await this.weatherService.registerNotifications(rq)
  }

  @Get('/verify')
  @HttpCode(HttpStatus.OK)
  async verify(@Query('token') token: string, @Res() res: Response) {
    try {
      const a = await this.weatherService.verify(token)
      console.log('a', a)
      res.redirect(`${this.configSer.get('FRONTEND_URL')}?success=true`)
    } catch {
      res.redirect(this.configSer.get('FRONTEND_URL'))
    }
  }

  @Get('/send-mail-daily')
  @HttpCode(HttpStatus.OK)
  async sendMailDaily() {
    return this.weatherService.sendMailDaily()
  }
}
