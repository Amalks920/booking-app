# 🔄 Refactored Bookings Module Example

This document shows how to refactor the Bookings module to handle interdependencies properly.

---

## 📁 New File Structure

```
src/
├── shared/
│   └── domain/
│       └── references/
│           ├── UserReference.ts          # ← NEW: Shared user reference
│           └── PropertyReference.ts      # ← NEW: Shared property reference
│
└── modules/
    └── bookings/
        ├── domain/
        │   ├── entities/
        │   │   └── Booking.ts
        │   ├── adapters/                 # ← NEW: Anti-Corruption Layer
        │   │   ├── IUserAdapter.ts
        │   │   └── IPropertyAdapter.ts
        │   ├── repositories/
        │   │   └── IBookingRepository.ts
        │   └── services/
        │       └── BookingService.ts     # ← MODIFIED: Uses adapters
        │
        ├── infrastructure/
        │   ├── adapters/                  # ← NEW: Adapter implementations
        │   │   ├── UserAdapter.ts
        │   │   └── PropertyAdapter.ts
        │   └── repositories/
        │       └── BookingRepository.ts  # ← MODIFIED: Transforms to references
```

---

## 1️⃣ Create Shared References

### `src/shared/domain/references/UserReference.ts`

```typescript
/**
 * Shared User Reference
 * 
 * Used for cross-module references to User entities.
 * Contains only minimal read-only data needed by other modules.
 * 
 * ⚠️ IMPORTANT: This is NOT the full User entity.
 * It's a minimal representation for cross-module communication.
 */
export interface UserReference {
  id: number;
  name: string;
  email: string;
}

/**
 * Helper to check if a value is a valid UserReference
 */
export function isUserReference(value: any): value is UserReference {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
  );
}
```

### `src/shared/domain/references/PropertyReference.ts`

```typescript
/**
 * Shared Property Reference
 * 
 * Used for cross-module references to Property entities.
 * Contains only essential read-only data.
 */
export interface PropertyReference {
  id: number;
  property_name: string;
  address: string;
  city: string;
  state: string;
  type: string;
}

export function isPropertyReference(value: any): value is PropertyReference {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'number' &&
    typeof value.property_name === 'string' &&
    typeof value.address === 'string'
  );
}
```

### `src/shared/domain/references/index.ts`

```typescript
export * from './UserReference';
export * from './PropertyReference';
```

---

## 2️⃣ Create Anti-Corruption Layer Interfaces

### `src/modules/bookings/domain/adapters/IUserAdapter.ts`

```typescript
import { UserReference } from '../../../../shared/domain/references';

/**
 * Anti-Corruption Layer for User module
 * 
 * Abstracts away the User module's internal structure.
 * Bookings module depends on this interface, not the User module directly.
 */
export interface IUserAdapter {
  /**
   * Get user by ID
   * Returns a UserReference (minimal representation)
   */
  getUserById(id: number): Promise<UserReference | null>;

  /**
   * Get user email by ID (lightweight query)
   */
  getUserEmail(id: number): Promise<string | null>;

  /**
   * Check if user exists
   */
  userExists(id: number): Promise<boolean>;
}
```

### `src/modules/bookings/domain/adapters/IPropertyAdapter.ts`

```typescript
import { PropertyReference } from '../../../../shared/domain/references';

/**
 * Anti-Corruption Layer for Property module
 */
export interface IPropertyAdapter {
  getPropertyById(id: number): Promise<PropertyReference | null>;
  propertyExists(id: number): Promise<boolean>;
  isPropertyAvailable(propertyId: number, checkIn: Date, checkOut: Date): Promise<boolean>;
}
```

---

## 3️⃣ Implement Adapters

### `src/modules/bookings/infrastructure/adapters/UserAdapter.ts`

```typescript
import { IUserAdapter } from '../../domain/adapters/IUserAdapter';
import { UserReference } from '../../../../shared/domain/references';
import { UserService } from '../../../users/domain/services/UserService';

/**
 * Adapter implementation for User module
 * 
 * This is the ONLY place where Bookings module depends on Users module.
 * All other parts of Bookings module use the IUserAdapter interface.
 */
export class UserAdapter implements IUserAdapter {
  constructor(private userService: UserService) {}

  async getUserById(id: number): Promise<UserReference | null> {
    const user = await this.userService.getUserById(id);
    
    if (!user) {
      return null;
    }

    // Transform User entity to UserReference
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  async getUserEmail(id: number): Promise<string | null> {
    const user = await this.userService.getUserById(id);
    return user?.email || null;
  }

  async userExists(id: number): Promise<boolean> {
    const user = await this.userService.getUserById(id);
    return user !== null;
  }
}
```

### `src/modules/bookings/infrastructure/adapters/PropertyAdapter.ts`

```typescript
import { IPropertyAdapter } from '../../domain/adapters/IPropertyAdapter';
import { PropertyReference } from '../../../../shared/domain/references';
import { PropertyService } from '../../../properties/domain/services/PropertyService';
import { BookingRepository } from '../../domain/repositories/IBookingRepository';

export class PropertyAdapter implements IPropertyAdapter {
  constructor(
    private propertyService: PropertyService,
    private bookingRepository: BookingRepository // For availability check
  ) {}

  async getPropertyById(id: number): Promise<PropertyReference | null> {
    const property = await this.propertyService.getPropertyById(id);
    
    if (!property) {
      return null;
    }

    // Transform Property entity to PropertyReference
    return {
      id: property.id,
      property_name: property.property_name,
      address: property.address,
      city: property.city,
      state: property.state,
      type: property.type
    };
  }

  async propertyExists(id: number): Promise<boolean> {
    const property = await this.propertyService.getPropertyById(id);
    return property !== null;
  }

  async isPropertyAvailable(
    propertyId: number,
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> {
    // Check for overlapping bookings
    const bookings = await this.bookingRepository.findByPropertyId(propertyId);
    
    return !bookings.some(booking => {
      const bookingCheckIn = new Date(booking.check_in_date);
      const bookingCheckOut = new Date(booking.check_out_date);
      
      // Check for date overlap
      return (
        (checkIn >= bookingCheckIn && checkIn < bookingCheckOut) ||
        (checkOut > bookingCheckIn && checkOut <= bookingCheckOut) ||
        (checkIn <= bookingCheckIn && checkOut >= bookingCheckOut)
      );
    });
  }
}
```

---

## 4️⃣ Update Booking Service

### `src/modules/bookings/domain/services/BookingService.ts` (REFACTORED)

```typescript
import { Booking, CreateBookingDto, UpdateBookingDto } from '../entities/Booking';
import { IBookingRepository } from '../repositories/IBookingRepository';
import { IUserAdapter } from '../adapters/IUserAdapter';           // ✅ Uses adapter interface
import { IPropertyAdapter } from '../adapters/IPropertyAdapter';   // ✅ Uses adapter interface
import { UserReference, PropertyReference } from '../../../../shared/domain/references'; // ✅ Uses shared references

export interface BookingWithRelations extends Booking {
  user?: UserReference;        // ✅ Changed from User to UserReference
  property?: PropertyReference; // ✅ Changed from Property to PropertyReference
}

export interface IBookingService {
  // Basic CRUD operations
  createBooking(bookingData: CreateBookingDto): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | null>;
  updateBooking(id: number, bookingData: UpdateBookingDto): Promise<Booking | null>;
  deleteBooking(id: number): Promise<boolean>;
  
  // Join operations
  getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null>;
  getUserBookingsWithProperties(userId: number): Promise<BookingWithRelations[]>;
  getPropertyBookingsWithUsers(propertyId: number): Promise<BookingWithRelations[]>;
  getAllBookingsWithRelations(): Promise<BookingWithRelations[]>;
  
  // Advanced queries
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]>;
  getBookingsByStatus(status: string): Promise<BookingWithRelations[]>;
  getBookingsByUserAndStatus(userId: number, status: string): Promise<BookingWithRelations[]>;
  getBookingStatsByProperty(): Promise<any[]>;
}

export class BookingService implements IBookingService {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly userAdapter: IUserAdapter,           // ✅ Injected adapter
    private readonly propertyAdapter: IPropertyAdapter   // ✅ Injected adapter
  ) {}

  async createBooking(bookingData: CreateBookingDto): Promise<Booking> {
    // Validate user exists using adapter
    const userExists = await this.userAdapter.userExists(bookingData.user_id);
    if (!userExists) {
      throw new Error('User not found');
    }

    // Validate property exists
    const propertyExists = await this.propertyAdapter.propertyExists(bookingData.property_id);
    if (!propertyExists) {
      throw new Error('Property not found');
    }

    // Check property availability
    const isAvailable = await this.propertyAdapter.isPropertyAvailable(
      bookingData.property_id,
      bookingData.check_in_date,
      bookingData.check_out_date
    );
    if (!isAvailable) {
      throw new Error('Property not available for the selected dates');
    }

    return this.bookingRepository.create(bookingData);
  }

  async getBookingById(id: number): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  async updateBooking(id: number, bookingData: UpdateBookingDto): Promise<Booking | null> {
    return this.bookingRepository.update(id, bookingData);
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookingRepository.delete(id);
  }

  async getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      return null;
    }

    // Fetch related data using adapters (parallel for performance)
    const [user, property] = await Promise.all([
      this.userAdapter.getUserById(booking.user_id),
      this.propertyAdapter.getPropertyById(booking.property_id)
    ]);

    return {
      ...booking,
      user,
      property
    };
  }

  async getUserBookingsWithProperties(userId: number): Promise<BookingWithRelations[]> {
    const bookings = await this.bookingRepository.findByUserId(userId);
    
    // Fetch properties in parallel
    const bookingsWithProperties = await Promise.all(
      bookings.map(async (booking) => {
        const property = await this.propertyAdapter.getPropertyById(booking.property_id);
        return {
          ...booking,
          property
        };
      })
    );

    return bookingsWithProperties;
  }

  async getPropertyBookingsWithUsers(propertyId: number): Promise<BookingWithRelations[]> {
    const bookings = await this.bookingRepository.findByPropertyId(propertyId);
    
    // Fetch users in parallel
    const bookingsWithUsers = await Promise.all(
      bookings.map(async (booking) => {
        const user = await this.userAdapter.getUserById(booking.user_id);
        return {
          ...booking,
          user
        };
      })
    );

    return bookingsWithUsers;
  }

  async getAllBookingsWithRelations(): Promise<BookingWithRelations[]> {
    const bookings = await this.bookingRepository.findAll();
    
    // Batch fetch related data
    const userIds = [...new Set(bookings.map(b => b.user_id))];
    const propertyIds = [...new Set(bookings.map(b => b.property_id))];

    const [users, properties] = await Promise.all([
      Promise.all(userIds.map(id => this.userAdapter.getUserById(id))),
      Promise.all(propertyIds.map(id => this.propertyAdapter.getPropertyById(id)))
    ]);

    // Create maps for O(1) lookup
    const userMap = new Map(
      users.filter(Boolean).map(u => [u!.id, u!])
    );
    const propertyMap = new Map(
      properties.filter(Boolean).map(p => [p!.id, p!])
    );

    // Combine bookings with related data
    return bookings.map(booking => ({
      ...booking,
      user: userMap.get(booking.user_id),
      property: propertyMap.get(booking.property_id)
    }));
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<BookingWithRelations[]> {
    // Implementation would use repository's date filtering
    // and then enrich with relations using adapters
    // (similar pattern as above)
    return [];
  }

  async getBookingsByStatus(status: string): Promise<BookingWithRelations[]> {
    // Similar pattern
    return [];
  }

  async getBookingsByUserAndStatus(userId: number, status: string): Promise<BookingWithRelations[]> {
    // Similar pattern
    return [];
  }

  async getBookingStatsByProperty(): Promise<any[]> {
    return this.bookingRepository.getBookingStatsByProperty();
  }
}
```

---

## 5️⃣ Update Repository (Transform to References)

### `src/modules/bookings/infrastructure/repositories/BookingRepository.ts` (REFACTORED)

```typescript
import { Op } from 'sequelize';
import { Booking, CreateBookingDto, UpdateBookingDto } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import BookingModel from '../models/Booking';
// ✅ Still import models for Sequelize joins (Infrastructure → Infrastructure is OK)
import UserModel from '../../../users/infrastructure/models/User';
import PropertyModel from '../../../properties/infrastructure/models/Property';
// ✅ Import shared references for return types
import { UserReference, PropertyReference } from '../../../../shared/domain/references';

export class SequelizeBookingRepository implements IBookingRepository {
  
  // Basic CRUD (unchanged)
  async create(bookingData: CreateBookingDto): Promise<Booking> {
    const booking = await BookingModel.create({
      ...bookingData,
      status: bookingData.status || 'pending'
    });
    return booking.toJSON() as Booking;
  }

  async findById(id: number): Promise<Booking | null> {
    const booking = await BookingModel.findByPk(id);
    return booking ? booking.toJSON() as Booking : null;
  }

  async update(id: number, bookingData: UpdateBookingDto): Promise<Booking | null> {
    const [updatedRows] = await BookingModel.update(bookingData, { where: { id } });
    return updatedRows > 0 ? this.findById(id) : null;
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await BookingModel.destroy({ where: { id } });
    return deletedRows > 0;
  }

  // ✅ NEW: Helper methods to transform Sequelize models to references
  private transformUserToReference(userModel: any): UserReference | null {
    if (!userModel) return null;
    return {
      id: userModel.id,
      name: userModel.name,
      email: userModel.email
    };
  }

  private transformPropertyToReference(propertyModel: any): PropertyReference | null {
    if (!propertyModel) return null;
    return {
      id: propertyModel.id,
      property_name: propertyModel.property_name,
      address: propertyModel.address,
      city: propertyModel.city,
      state: propertyModel.state,
      type: propertyModel.type
    };
  }

  // ✅ If you still want to use Sequelize joins (optimization), transform the result
  async getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null> {
    // This method is now DEPRECATED - use service layer with adapters instead
    // But kept for backward compatibility or performance optimization
    
    const booking = await BookingModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: PropertyModel,
          as: 'property',
          attributes: ['id', 'property_name', 'address', 'city', 'state', 'type']
        }
      ]
    });

    if (!booking) return null;

    const bookingData = booking.toJSON();
    
    // Transform to references
    return {
      ...bookingData,
      user: this.transformUserToReference(bookingData.user),
      property: this.transformPropertyToReference(bookingData.property)
    } as BookingWithRelations;
  }

  // Similar transformations for other methods...
}
```

---

## 6️⃣ Update Container (Wire Dependencies)

### `src/modules/bookings/infrastructure/container/BookingContainer.ts` (UPDATED)

```typescript
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { IBookingService } from '../../domain/services/BookingService';
import { SequelizeBookingRepository } from '../repositories/BookingRepository';
import { BookingService } from '../../domain/services/BookingService';
import { BookingController } from '../../application/controllers/BookingController';
import { IUserAdapter } from '../../domain/adapters/IUserAdapter';
import { IPropertyAdapter } from '../../domain/adapters/IPropertyAdapter';
import { UserAdapter } from '../adapters/UserAdapter';
import { PropertyAdapter } from '../adapters/PropertyAdapter';
// ✅ Only infrastructure imports from other modules
import { UserService } from '../../../users/domain/services/UserService';
import { UserRepositoryImpl } from '../../../users/infrastructure/repositories/UserRepositoryImpl';
import { PropertyService } from '../../../properties/domain/services/PropertyService';
import { PropertyRepositoryImpl } from '../../../properties/infrastructure/repositories/PropertyRepositoryImpl';

export class BookingContainer {
  private static instance: BookingContainer;
  
  private constructor() {}
  
  static getInstance(): BookingContainer {
    if (!BookingContainer.instance) {
      BookingContainer.instance = new BookingContainer();
    }
    return BookingContainer.instance;
  }

  // Repository
  getBookingRepository(): IBookingRepository {
    return new SequelizeBookingRepository();
  }

  // ✅ Adapters (only place where we depend on other modules)
  getUserAdapter(): IUserAdapter {
    const userRepository = new UserRepositoryImpl();
    const userService = new UserService(userRepository);
    return new UserAdapter(userService);
  }

  getPropertyAdapter(): IPropertyAdapter {
    const propertyRepository = new PropertyRepositoryImpl();
    const propertyService = new PropertyService(propertyRepository);
    const bookingRepository = this.getBookingRepository();
    return new PropertyAdapter(propertyService, bookingRepository);
  }

  // Service with injected adapters
  getBookingService(): IBookingService {
    const repository = this.getBookingRepository();
    const userAdapter = this.getUserAdapter();
    const propertyAdapter = this.getPropertyAdapter();
    return new BookingService(repository, userAdapter, propertyAdapter);
  }

  // Controller
  getBookingController(): BookingController {
    const service = this.getBookingService();
    return new BookingController(service);
  }
}
```

---

## ✅ Benefits of This Refactoring

1. **✅ No Domain Dependencies**: Bookings domain no longer depends on Users/Properties domains
2. **✅ Easy Testing**: Mock adapters instead of entire modules
3. **✅ Flexible**: Can swap adapter implementations (e.g., for API calls in microservices)
4. **✅ Clear Boundaries**: Dependencies are explicit and contained
5. **✅ Microservices Ready**: Extract adapters to HTTP clients when needed
6. **✅ Type Safe**: Shared references ensure consistency

---

## 🔄 Migration Checklist

- [ ] Create `shared/domain/references/` folder
- [ ] Define `UserReference` and `PropertyReference`
- [ ] Create adapter interfaces in `bookings/domain/adapters/`
- [ ] Implement adapters in `bookings/infrastructure/adapters/`
- [ ] Update `BookingService` to use adapters
- [ ] Update `BookingContainer` to wire dependencies
- [ ] Remove direct imports from `BookingService.ts`
- [ ] Update tests to use mock adapters
- [ ] Update documentation

---

This refactoring maintains functionality while achieving proper module independence! 🎉

