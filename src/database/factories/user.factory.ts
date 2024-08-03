import { setSeederFactory } from 'typeorm-extension'
import { fakerVI } from '@faker-js/faker'

import { User } from '../entities'

export default setSeederFactory(User, async () => {
  const user = new User()

  const sexType = fakerVI.person.sexType()

  user.givenName = fakerVI.person.firstName(sexType)
  user.surname = fakerVI.person.lastName(sexType)

  return user
})
