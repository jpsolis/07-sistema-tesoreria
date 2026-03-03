
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ type: 'varchar', length: 254, unique: true})
    email: string;

    @Column('text', {
        select: false
    })
    password?: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('simple-array')
    roles: string[] = ['user'];

    // @OneToMany(
    //     () => Reparacion, 
    //     ( reparacion ) => reparacion.user
    // )
    // reparacion : Reparacion;


    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
