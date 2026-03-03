import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload';



@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ){}

 async create(createUserDto: CreateUserDto) {


    try {

        const { password, ...userData} = createUserDto;
      
      const user = this.userRepository.create({
    ...userData, 
    password: bcrypt.hashSync(password, 10)

      });

     await this.userRepository.save(user);
    delete user.password;

     return  {
        ...user,
      token: this.getJwtToken({ id: user.id })
     }
      
    } catch (error) {
      this.handleDBErrors(error);
    }


  }


  async login(loginUserDto: LoginUserDto){
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ 
      where : { email }, 
      select: {email: true, password: true, id: true } //! OJO !
     });

     if(!user)
      throw new UnauthorizedException('Credenciales no válidas (email)')

     if(!bcrypt.compareSync(password, user.password ?? ''))
       throw new UnauthorizedException('Credenciales no válidas (password)')

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
   
  }

  async checkAuthStatus( user: User){

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleDBErrors(error: any): never{
    console.log('Error: ' + error)
    if(error.driverError.code === 'ER_DUP_ENTRY')
      throw new BadRequestException(error.driverError.sqlMessage);
    



    console.log(error.driverError.sqlMessage);

    throw new InternalServerErrorException('Favor revisar log de servidor');
  }

}
