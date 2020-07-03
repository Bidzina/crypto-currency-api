import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Currency {

    @PrimaryGeneratedColumn()
    id: number;

   @Column()
   data: string

    @Column({ type: 'date', default: () => Date.now() })
    last_update: string;

}
