import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common'

import { apiWeather } from '@/common/configs'
import {
  FindCitiesRequest,
  GetCurrentWeatherRequest,
  GetForeCastWeatherRequest,
  RegisterNotificationsRequest,
} from './request'
import { CityResponse, CurrentWeatherResponse } from './response'
import { plainToInstance } from 'class-transformer'
import { addDays, format } from 'date-fns'
import { Cron, CronExpression } from '@nestjs/schedule'
import { EmailService } from '../email/email.service'
import { GetCurrentIpWeatherRequest } from './request/get-current-ip-weather.request'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@nestjs-modules/mailer'
import { InjectRepository } from '@nestjs/typeorm'
import { WeatherNotification } from '@/database/entities'
import { Repository } from 'typeorm'

@Injectable()
export class WeatherService {
  constructor(
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(WeatherNotification)
    private readonly weatherNotiRepo: Repository<WeatherNotification>,
  ) {}

  public async findCities(findCityRequest: FindCitiesRequest): Promise<CityResponse[]> {
    const { q } = findCityRequest

    const { data: cities } = await apiWeather.get<any[]>('/search.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q,
      },
    })

    return plainToInstance(CityResponse, cities, {
      excludeExtraneousValues: true,
    })
  }

  public async getCurrentWeather(
    getCurrentWeatherRequest: GetCurrentWeatherRequest,
  ): Promise<CurrentWeatherResponse> {
    const { q } = getCurrentWeatherRequest

    try {
      const { data: currentWeather } = await apiWeather.get<any>('/current.json', {
        params: {
          key: process.env.WEATHER_API_KEY,
          q,
        },
      })

      return plainToInstance(CurrentWeatherResponse, currentWeather, {
        excludeExtraneousValues: true,
      })
    } catch (err) {
      if (err.response.data) {
        throw new HttpException(err?.response?.data?.error, err.response.status)
      } else {
        console.error(err)
        throw new InternalServerErrorException()
      }
    }
  }

  public async getCurrentIpWeather(
    getCurrentWeatherRequest: GetCurrentIpWeatherRequest,
  ): Promise<CurrentWeatherResponse> {
    const ip = getCurrentWeatherRequest.ip
    try {
      const { data: currentIp } = await apiWeather.get<any>('/ip.json', {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: ip,
        },
      })

      if (!currentIp.city) {
        throw new NotFoundException()
      }

      const { data: currentWeather } = await apiWeather.get<any>('/current.json', {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: currentIp.city,
        },
      })

      return plainToInstance(CurrentWeatherResponse, currentWeather, {
        excludeExtraneousValues: true,
      })
    } catch (err) {
      if (err.response.data) {
        throw new HttpException(err?.response?.data?.error, err.response.status)
      } else {
        console.error(err)
        throw new InternalServerErrorException()
      }
    }
  }

  public async getForecastWeather(
    getForeCastWeatherRequest: GetForeCastWeatherRequest,
  ): Promise<any> {
    const { q, page, perPage } = getForeCastWeatherRequest
    const daysRequested = (Number(page) - 1) * Number(perPage) + Number(perPage) + 1
    const maxForecastAvailableDays = 14

    try {
      let initialForecasts = []
      if (!(daysRequested - maxForecastAvailableDays >= perPage)) {
        const {
          data: {
            forecast: { forecastday: fetchedForecasts },
          },
        } = await apiWeather.get<any>('/forecast.json', {
          params: {
            key: process.env.WEATHER_API_KEY,
            q,
            days: daysRequested,
          },
        })

        initialForecasts = [...fetchedForecasts]
      }

      let additionalForecasts = []
      if (daysRequested > maxForecastAvailableDays) {
        for (let i = maxForecastAvailableDays; i < daysRequested; i++) {
          const forecastDate = format(addDays(new Date(), i), 'yyyy-MM-dd')
          const additionalData = await this.loadAdditionalForecast(q, forecastDate)
          additionalForecasts.push(additionalData)
        }
      }

      return [...initialForecasts, ...additionalForecasts]
        .map(forecast => {
          return {
            date: forecast.date,
            temp_c: forecast.day.avgtemp_c,
            condition: forecast.day.condition,
            wind_mph: forecast.day.maxwind_mph,
            humidity: forecast.day.avghumidity,
          }
        })
        .slice(-perPage)
    } catch (err) {
      if (err.response.data) {
        throw new HttpException(err?.response?.data?.error, err.response.status)
      } else {
        console.error(err)
        throw new InternalServerErrorException()
      }
    }
  }

  private async loadAdditionalForecast(q: string, date: string): Promise<any> {
    const {
      data: {
        forecast: { forecastday: additionalForecast },
      },
    } = await apiWeather.get<any>('/future.json', {
      params: {
        key: process.env.WEATHER_API_KEY,
        q,
        dt: date,
      },
    })

    return additionalForecast[0]
  }

  // @Cron('0 */1 * * * *')
  public async lockTimeSheet(): Promise<void> {
    // await this.emailService.sendMail()
  }

  public async registerNotifications(rq: RegisterNotificationsRequest) {
    const { email, city } = rq
    const tokenVerify = this.jwtService.sign(
      {
        email,
        city,
      },
      {
        secret: this.configService.get('SECRET_KEY'),
      },
    )
    this.emailService.sendVerifyMail(email, tokenVerify)

    return {
      message: 'Please check your email!',
    }
  }

  public async verify(token: string) {
    const payloads = this.jwtService.verify(token, {
      secret: this.configService.get('SECRET_KEY'),
    })
    const weatherRegistation = this.weatherNotiRepo.create({
      email: payloads.email,
      city: payloads.city,
    })
    return await this.weatherNotiRepo.save(weatherRegistation)
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  public async sendMailDaily() {
    const resgitations = await this.weatherNotiRepo.find()
    resgitations.forEach(async resgitation => {
      const { data: currentWeather } = await apiWeather.get<any>('/current.json', {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: resgitation.city,
        },
      })
      this.emailService.sendMailDaily(resgitation.email, currentWeather)
    })
    return resgitations
  }
}
