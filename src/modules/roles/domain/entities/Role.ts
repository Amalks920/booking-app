export interface Role {
  id: number;
  role: string;
  code: string;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoleDto {
  role: string;
  code: string;
  created_by: number;
  updated_by: number;
}

export interface UpdateRoleDto {
  role?: string;
  code?: string;
}

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role | null>;
  create(roleData: CreateRoleDto): Promise<Role>;
  update(id: number, roleData: UpdateRoleDto): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
} 