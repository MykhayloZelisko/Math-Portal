import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '../../rating/models/rating.model';
import { Comment } from '../../comments/models/comment.model';

interface UserCreationAttrsInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Table({
  tableName: 'users',
  createdAt: false,
  updatedAt: false,
  underscored: true,
})
export class User extends Model<User, UserCreationAttrsInterface> {
  @ApiProperty({ example: '68f48b22-8104-4b47-b846-3db152d8b0ee', description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @Column({ type: DataType.STRING, allowNull: false })
  public firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @Column({ type: DataType.STRING, allowNull: false })
  public lastName: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @Column({ type: DataType.STRING, allowNull: false })
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @ApiProperty({ example: 'email@mail.com', description: 'Email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  public email: string;

  @ApiProperty({ example: 'q1we5?!ER234', description: 'Password' })
  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @ApiProperty({
    example: '0beb787a-e8c2-4c55-b225-aa117352c766',
    description: 'unique photo name',
  })
  @Column({ type: DataType.UUID, defaultValue: null })
  public photo: string | null;

  @ApiProperty({ example: false, description: 'User is an admin or not' })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  public isAdmin: boolean;

  @HasMany(() => Rating)
  public ratings: Rating[];

  @HasMany(() => Comment)
  public comments: Comment[];
}
