import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { List } from "./List";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column({ unique: true })
	username!: string;

	@Field()
	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@OneToMany(() => List, (list) => list.creator)
	lists: List[];

	@Field(() => String)
	@CreateDateColumn()
	createdAt = Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt = Date;
}
