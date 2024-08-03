import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RegisterNotificationsRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  city: string
}
