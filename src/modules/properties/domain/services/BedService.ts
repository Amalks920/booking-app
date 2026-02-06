import { CreateBedDto, IBedRepository, Bed, UpdateBedDto } from "../entities/Bed";

export class BedService {
    constructor(private bedRepository: IBedRepository) { }

    async getAllBeds(): Promise<Bed[]> {
        return this.bedRepository.findAll();
    }

    async getBedById(id: string): Promise<Bed | null> {
        return this.bedRepository.findById(id);
    }

    async getBedsByRoomId(roomId: string): Promise<Bed[]> {
        return this.bedRepository.findByRoomId(roomId);
    }

    async createBed(bedData: CreateBedDto, user_id: string): Promise<Bed> {
        return this.bedRepository.create(bedData, user_id);
    }

    async updateBed(id: string, bedData: UpdateBedDto, user_id: string): Promise<Bed | null> {
        return this.bedRepository.update(id, { ...bedData, updated_by: user_id });
    }

    async deleteBed(id: string): Promise<boolean> {
        return this.bedRepository.delete(id);
    }
}
