import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('produtos')
export class Produto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nome: string;

    @Column({ type: 'text', nullable: true })
    descricao?: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    preco: number;

    @Column({ type: 'int', nullable: false })
    quantidadeEmEstoque: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    categoria?: string;
}
