import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { Role } from '../../roles/entities/role.entity';
import { Menu } from '../../menus/entities/menu.entity';
import User from '../../users/entities/user.entity';

@Entity('permissions')
export class Permission extends BaseModel {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  action: string; // CREATE, READ, UPDATE, DELETE

  @Column({ type: 'varchar', length: 100 })
  resource: string; // The resource this permission applies to

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];

  @ManyToMany(() => Menu, menu => menu.permissions)
  @JoinTable({
    name: 'permission_menus',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' }
  })
  menus: Menu[];

//   @ManyToMany(() => User, (user) => user.permissions)
// users: User[];
}
