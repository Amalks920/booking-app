export class Bed {
    constructor(
        public id: string,
        public room_id: string,
        public bed_type: string,
        public quantity: number,
        public created_by: string,
        public updated_by: string,
        public created_at?: Date,
        public updated_at?: Date
    ) { }
}

export interface CreateBedDto {
    room_id: string;
    bed_type: string;
    quantity: number;
}

export interface UpdateBedDto {
    bed_type?: string;
    quantity?: number;
    updated_by?: string;
}

export interface IBedRepository {
    findAll(): Promise<Bed[]>;
    findById(id: string): Promise<Bed | null>;
    findByRoomId(roomId: string): Promise<Bed[]>;
    create(bedData: CreateBedDto, user_id: string): Promise<Bed>;
    update(id: string, bedData: UpdateBedDto): Promise<Bed | null>;
    delete(id: string): Promise<boolean>;
}
