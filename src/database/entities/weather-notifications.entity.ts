import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'weather_notifications' })
export class WeatherNotification {
  @PrimaryColumn({ length: 100 })
  email: string

  @PrimaryColumn({ length: 100 })
  city: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: string
}
