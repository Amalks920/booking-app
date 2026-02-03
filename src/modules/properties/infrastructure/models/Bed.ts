import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../../../config/database';

export interface BedAttributes {
    id: string;
    room_id: string;
    bed_type: string;
    quantity: number;
    created_by: string;
    updated_by: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface BedCreationAttributes extends Optional<BedAttributes, 'id'> { }

export class BedModel extends Model<BedAttributes, BedCreationAttributes> implements BedAttributes {
    public id!: string;
    public room_id!: string;
    public bed_type!: string;
    public quantity!: number;
    public created_by!: string;
    public updated_by!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

BedModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        room_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'rooms',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        bed_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'beds',
        modelName: 'Bed',
        timestamps: false,
    }
);

export default BedModel;
