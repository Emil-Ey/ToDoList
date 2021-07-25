import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { List } from "./List";

@ObjectType()
@Entity()
export class Task extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@PrimaryColumn()
	listId: number;

	@Field()
	@Column()
	text!: string;

	@Field()
	@Column({ default: false })
	done: boolean;

	@ManyToOne(() => List, (list) => list.tasks)
	list: List;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;
}
