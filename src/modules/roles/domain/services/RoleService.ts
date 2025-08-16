import { Role, CreateRoleDto, UpdateRoleDto, RoleRepository } from '../entities/Role';

export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: number): Promise<Role | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid role ID');
    }
    return this.roleRepository.findById(id);
  }

  async createRole(roleData: CreateRoleDto): Promise<Role> {
    if (!roleData.role || !roleData.code) {
      throw new Error('Role name and code are required');
    }

    if (!roleData.created_by || !roleData.updated_by) {
      throw new Error('Created by and updated by are required');
    }

    if (!this.isValidRoleCode(roleData.code)) {
      throw new Error('Role code must be uppercase and alphanumeric');
    }

    return this.roleRepository.create(roleData);
  }

  async updateRole(id: number, roleData: UpdateRoleDto): Promise<Role | null> {
    if (!id || id <= 0) {
      throw new Error('Invalid role ID');
    }

    if (roleData.code && !this.isValidRoleCode(roleData.code)) {
      throw new Error('Role code must be uppercase and alphanumeric');
    }

    return this.roleRepository.update(id, roleData);
  }

  async deleteRole(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('Invalid role ID');
    }

    return this.roleRepository.delete(id);
  }

  private isValidRoleCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9_]+$/;
    return codeRegex.test(code);
  }
} 