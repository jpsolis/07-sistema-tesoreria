import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

  // const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler() )
  const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
 
    

      if( !validRoles ) return true;
      if( validRoles.length === 0 ) return true;


      const req = context.switchToHttp().getRequest();
      const user = req.user as User;   

      console.log({ userRoles: user.roles });
      console.log({ validRoles });

      if( !user )
        throw new BadRequestException('Usuario no encontrado');

      for (const role of user.roles) {
        if( validRoles.includes( role ) ){
          return true;
        }
      }

      throw new ForbiddenException(
        `Usuario ${ user.fullName } necesita un rol válido: [${ validRoles }]`
      )

      //console.log({ userRoles: user.roles })

    return true;
  }
}
