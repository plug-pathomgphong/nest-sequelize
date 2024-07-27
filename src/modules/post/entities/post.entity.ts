import { BelongsTo, Column, DataType, ForeignKey } from "sequelize-typescript";
import { User } from "src/modules/users/entities/user.entity";

export class Post{
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title:string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    description: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId:number;

    @BelongsTo(() => User)
    user: User;
}