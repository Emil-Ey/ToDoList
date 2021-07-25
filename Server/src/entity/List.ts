import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@ObjectType()
@Entity()
export class List extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field()
	@Column()
	title!: string;

	@Field()
	@Column()
	desc!: string;

	@Field()
	@Column({ type: "int", default: 0 })
	tasksNo: number;

	@Field()
	@Column()
	creatorId: number;

	@ManyToOne(() => User, (user) => user.lists)
	creator: User;

	@OneToMany(() => Task, (task) => task.list)
	tasks: Task[];

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
