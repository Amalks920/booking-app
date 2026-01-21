export interface Role {
  id: string;
  role: string;
  code: string;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRoleDto {
  role: string;
  code: string;
  created_by: string;
  updated_by: string;
}

export interface UpdateRoleDto {
  role?: string;
  code?: string;
}

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  create(roleData: CreateRoleDto): Promise<Role>;
  update(id: string, roleData: UpdateRoleDto): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
} 