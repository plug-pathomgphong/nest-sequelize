
import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Post extends Model {
    @Column
    id:string;

    @Column
    title:string;

    @Column
    description: string;

    @Column
    createdDate: Date;

    @Column
    updatedDate: Date;
}
