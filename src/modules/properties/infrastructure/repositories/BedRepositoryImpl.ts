import { Bed, CreateBedDto, UpdateBedDto, IBedRepository } from '../../domain/entities/Bed';
import BedModel from '../models/Bed';

export class BedRepositoryImpl implements IBedRepository {
    async findAll(): Promise<Bed[]> {
        const beds = await BedModel.findAll();
        return beds.map(b => new Bed(
            b.id,
            b.room_id,
            b.bed_type,
            b.quantity,
            b.created_by,
            b.updated_by,
            b.created_at,
            b.updated_at
        ));
    }

    async findById(id: string): Promise<Bed | null> {
        const bed = await BedModel.findByPk(id);
        if (!bed) return null;

        return new Bed(
            bed.id,
            bed.room_id,
            bed.bed_type,
            bed.quantity,
            bed.created_by,
            bed.updated_by,
            bed.created_at,
            bed.updated_at
        );
    }

    async findByRoomId(roomId: string): Promise<Bed[]> {
        console.log(roomId, 'room___id');
        const beds = await BedModel.findAll({ where: { room_id: roomId } });
        return beds.map(b => new Bed(
            b.id,
            b.room_id,
            b.bed_type,
            b.quantity,
            b.created_by,
            b.updated_by,
            b.created_at,
            b.updated_at
        ));
    }

    async create(bedData: CreateBedDto, user_id: string): Promise<Bed> {
        const newBed = await BedModel.create({
            room_id: bedData.room_id,
            bed_type: bedData.bed_type,
            quantity: bedData.quantity,
            created_by: user_id,
            updated_by: user_id
        });

        return new Bed(
            newBed.id,
            newBed.room_id,
            newBed.bed_type,
            newBed.quantity,
            newBed.created_by,
            newBed.updated_by,
            newBed.created_at,
            newBed.updated_at
        );
    }

    async update(id: string, bedData: UpdateBedDto): Promise<Bed | null> {
        const bed = await BedModel.findByPk(id);
        if (!bed) return null;

        const updateData: Partial<Omit<Bed, 'id' | 'created_at' | 'updated_at'>> = {};
        Object.assign(updateData, bedData);
        // Explicitly set updated_by if provided (it should be)
        if (bedData.updated_by) {
            // @ts-ignore - somehow TS might complain about optional mismatch but model has it
            updateData.updated_by = bedData.updated_by;
        }

        const updatedBed = await bed.update(updateData as any);

        return new Bed(
            updatedBed.id,
            updatedBed.room_id,
            updatedBed.bed_type,
            updatedBed.quantity,
            updatedBed.created_by,
            updatedBed.updated_by,
            updatedBed.created_at,
            updatedBed.updated_at
        );
    }

    async delete(id: string): Promise<boolean> {
        const bed = await BedModel.findByPk(id);
        if (!bed) return false;

        await bed.destroy();
        return true;
    }
}
