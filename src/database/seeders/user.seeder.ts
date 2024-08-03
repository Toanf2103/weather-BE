import { DataSource, Repository } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { faker } from '@faker-js/faker'
import { User } from '../entities'

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const userRepository = dataSource.getRepository(User)
    const userFactory = factoryManager.get(User)

    await userFactory.saveMany(10)
  }
}
