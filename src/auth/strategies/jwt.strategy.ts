import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";



@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

     constructor(
            @InjectRepository( User )
            private readonly userRepository: Repository<User>,

            configService: ConfigService
        ) {
            
            super({
                secretOrKey: configService.get('JWT_SECRET') as string,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                
            });
        }

    async validate( payload: JwtPayload ) : Promise<User> {
       
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id }); 

        if( !user )
            throw new UnauthorizedException('Token no válido')

        if( !user.isActive )
            throw new UnauthorizedException('Usuario está inactivo, habla con un admin');


        //console.log({ user })

        return user;
    }

}