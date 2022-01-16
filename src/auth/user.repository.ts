import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  //회원 생성
  async createUser(authCredentialDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialDto;

    //암호 hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      console.log('error', error);
      if (error.code === '23505') {
        throw new ConflictException('Existing username.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
