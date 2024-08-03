import { IsNotEmpty, IsString } from 'class-validator'

export class FindCitiesRequest {
  @IsString()
  @IsNotEmpty()
  q: string
}
