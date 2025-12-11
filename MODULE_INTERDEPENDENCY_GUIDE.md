# 🔗 Module Interdependency Handling Guide

## 🎯 Overview

This guide addresses how to handle dependencies between modules in a Modular Monolith architecture while maintaining module independence and enabling future microservices migration.

---

## 🚨 Current Issues

### **Direct Dependencies Found:**

1. **Bookings Module → Users Module**
   ```typescript
   // ❌ BAD: Direct import from another module's domain
   import { User } from '../../../users/domain/entities/User';
   
   // ❌ BAD: Direct import from another module's infrastructure
   import User from '../../../users/infrastructure/models/User';
   ```

2. **Bookings Module → Properties Module**
   ```typescript
   // ❌ BAD: Direct domain entity import
   import { Property } from '../../../properties/domain/entities/Property';
   
   // ❌ BAD: Direct infrastructure model import
   import PropertyModel from '../../../properties/infrastructure/models/Property';
   ```

### **Problems with Direct Dependencies:**
- ❌ **Tight Coupling**: Modules can't be extracted independently
- ❌ **Circular Dependency Risk**: Module A → Module B → Module A
- ❌ **Testing Complexity**: Hard to mock dependencies
- ❌ **Microservices Migration**: Difficult to split into services
- ❌ **Violates Clean Architecture**: Domain layers shouldn't depend on other domains

---

## ✅ Best Practices for Module Interdependency

### **1. Dependency Direction Rules**

```
┌─────────────────────────────────────────┐
│         Dependency Flow Rules           │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Infrastructure → Infrastructure     │
│  ✅ Application → Application (via API)  │
│  ❌ Domain → Domain (NEVER!)           │
│  ✅ Infrastructure → Domain (local)     │
│  ✅ Application → Domain (local)        │
│                                         │
└─────────────────────────────────────────┘
```

**Key Principle:** Domain layers should NEVER depend on other modules' domain layers.

---

## 🎯 Solution Patterns

### **Pattern 1: Shared Kernel (Recommended for Read-Only Entities)**

Create a shared folder for common domain concepts that multiple modules need to reference.

```
src/
├── shared/
│   └── domain/              # Shared domain concepts
│       ├── entities/
│       │   ├── User.ts      # Minimal user representation
│       │   └── Property.ts # Minimal property representation
│       └── types/
```

**Example Implementation:**

```typescript
// src/shared/domain/entities/UserReference.ts
/**
 * Shared user reference - minimal representation
 * Used for cross-module references
 * Only includes IDs and essential read-only data
 */
export interface UserReference {
  id: number;
  name: string;
  email: string;
  // Only include fields needed for cross-module operations
  // NO business logic, NO methods
}

// src/shared/domain/entities/PropertyReference.ts
export interface PropertyReference {
  id: number;
  property_name: string;
  address: string;
  city: string;
  type: string;
  // Only essential read-only fields
}
```

**Usage in Bookings Module:**

```typescript
// src/modules/bookings/domain/services/BookingService.ts
import { UserReference, PropertyReference } from '../../../../shared/domain/entities';

export interface BookingWithRelations extends Booking {
  user?: UserReference;      // ✅ Uses shared reference, not full entity
  property?: PropertyReference;
}
```

**Benefits:**
- ✅ No direct domain dependencies
- ✅ Minimal coupling
- ✅ Easy to extract modules
- ✅ Clear boundaries

---

### **Pattern 2: Anti-Corruption Layer (ACL) - For Complex Dependencies**

Create adapter interfaces in the consuming module that translate external module concepts.

```
src/modules/bookings/
├── domain/
│   └── adapters/              # Anti-Corruption Layer
│       ├── IUserAdapter.ts
│       └── IPropertyAdapter.ts
└── infrastructure/
    └── adapters/
        ├── UserAdapter.ts
        └── PropertyAdapter.ts
```

**Example Implementation:**

```typescript
// src/modules/bookings/domain/adapters/IUserAdapter.ts
/**
 * Anti-Corruption Layer for User module
 * Abstracts away the User module's internal structure
 */
export interface IUserAdapter {
  getUserById(id: number): Promise<UserInfo | null>;
  getUserEmail(id: number): Promise<string | null>;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  // Only what Bookings module needs
}

// src/modules/bookings/infrastructure/adapters/UserAdapter.ts
import { IUserAdapter, UserInfo } from '../../domain/adapters/IUserAdapter';
import { UserService } from '../../../users/domain/services/UserService';

export class UserAdapter implements IUserAdapter {
  constructor(private userService: UserService) {}

  async getUserById(id: number): Promise<UserInfo | null> {
    const user = await this.userService.getUserById(id);
    if (!user) return null;

    // Transform to Booking module's representation
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
}
```

**Usage:**

```typescript
// src/modules/bookings/domain/services/BookingService.ts
import { IUserAdapter } from '../adapters/IUserAdapter';
import { IPropertyAdapter } from '../adapters/IPropertyAdapter';

export class BookingService {
  constructor(
    private bookingRepository: IBookingRepository,
    private userAdapter: IUserAdapter,      // ✅ Injected adapter
    private propertyAdapter: IPropertyAdapter
  ) {}

  async getBookingWithDetails(id: number) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) return null;

    // Use adapters instead of direct imports
    const user = await this.userAdapter.getUserById(booking.user_id);
    const property = await this.propertyAdapter.getPropertyById(booking.property_id);

    return {
      ...booking,
      user,
      property
    };
  }
}
```

**Benefits:**
- ✅ Complete isolation from other modules
- ✅ Can swap implementations easily
- ✅ Perfect for microservices migration
- ✅ Easy to test (mock adapters)

---

### **Pattern 3: Domain Events (Recommended for Cross-Module Communication)**

Use events for loose coupling when modules need to react to changes in other modules.

```
src/shared/
└── events/
    ├── DomainEvent.ts
    ├── EventBus.ts
    └── events/
        ├── UserCreated.ts
        ├── BookingCreated.ts
        └── PropertyUpdated.ts
```

**Example Implementation:**

```typescript
// src/shared/events/DomainEvent.ts
export interface DomainEvent {
  eventType: string;
  aggregateId: string | number;
  occurredOn: Date;
  payload: Record<string, any>;
}

// src/shared/events/EventBus.ts
export class EventBus {
  private static handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

  static subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  static async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    await Promise.all(handlers.map(handler => handler(event)));
  }
}

// src/shared/events/events/UserCreated.ts
export interface UserCreatedEvent extends DomainEvent {
  eventType: 'UserCreated';
  payload: {
    userId: number;
    email: string;
    name: string;
  };
}

// Usage in Users Module (Publisher)
import { EventBus } from '../../../shared/events/EventBus';
import { UserCreatedEvent } from '../../../shared/events/events/UserCreated';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(userData);
    
    // Publish event
    await EventBus.publish({
      eventType: 'UserCreated',
      aggregateId: user.id,
      occurredOn: new Date(),
      payload: {
        userId: user.id,
        email: user.email,
        name: user.name
      }
    });

    return user;
  }
}

// Usage in Bookings Module (Subscriber)
import { EventBus } from '../../../shared/events/EventBus';
import { UserCreatedEvent } from '../../../shared/events/events/UserCreated';

// Subscribe on module initialization
EventBus.subscribe('UserCreated', async (event: UserCreatedEvent) => {
  // React to user creation
  console.log(`New user created: ${event.payload.email}`);
  // Could send welcome email, create default booking preferences, etc.
});
```

**Benefits:**
- ✅ Complete decoupling
- ✅ Asynchronous processing
- ✅ Easy to add new subscribers
- ✅ Perfect for microservices (replace EventBus with message queue)

---

### **Pattern 4: Application Services Integration (For Orchestration)**

When you need to coordinate operations across modules, use application services at the application layer.

```
src/modules/bookings/
└── application/
    └── services/
        └── BookingOrchestrationService.ts
```

**Example:**

```typescript
// src/modules/bookings/application/services/BookingOrchestrationService.ts
import { BookingService } from '../../domain/services/BookingService';
import { UserService } from '../../../users/domain/services/UserService';
import { PropertyService } from '../../../properties/domain/services/PropertyService';

/**
 * Orchestrates booking creation across multiple modules
 * This is OK because it's at the APPLICATION layer, not DOMAIN layer
 */
export class BookingOrchestrationService {
  constructor(
    private bookingService: BookingService,
    private userService: UserService,      // ✅ Application → Application is OK
    private propertyService: PropertyService
  ) {}

  async createBookingWithValidation(
    userId: number,
    propertyId: number,
    bookingData: CreateBookingDto
  ) {
    // Validate user exists
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate property exists
    const property = await this.propertyService.getPropertyById(propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Create booking
    return await this.bookingService.createBooking({
      ...bookingData,
      user_id: userId,
      property_id: propertyId
    });
  }
}
```

**Rules:**
- ✅ OK: Application layer can depend on other modules' application layers
- ✅ OK: Can call other modules' services for orchestration
- ❌ NOT OK: Domain layer depending on other domains

---

### **Pattern 5: Repository Queries Only in Infrastructure (Current Approach - Acceptable)**

Your current approach of importing Sequelize models in the repository layer is **acceptable** but can be improved.

**Current (Acceptable):**
```typescript
// src/modules/bookings/infrastructure/repositories/BookingRepository.ts
import User from '../../../users/infrastructure/models/User';  // ✅ Infrastructure → Infrastructure
import PropertyModel from '../../../properties/infrastructure/models/Property';

// Use for Sequelize joins - OK because it's infrastructure
const booking = await BookingModel.findByPk(id, {
  include: [
    { model: User, as: 'user' },
    { model: PropertyModel, as: 'property' }
  ]
});
```

**Better Approach - Use Type IDs Only:**
```typescript
// Keep foreign key IDs in domain, fetch related data only when needed
export interface Booking {
  id: number;
  user_id: number;        // ✅ Just store the ID
  property_id: number;    // ✅ Just store the ID
  // ... other fields
}

// In repository, transform the joined data
async getBookingWithUserAndProperty(id: number): Promise<BookingWithRelations | null> {
  const booking = await BookingModel.findByPk(id, {
    include: [/* ... */]
  });
  
  // Transform to use shared references or adapter pattern
  return this.transformToBookingWithRelations(booking);
}
```

---

## 📋 Recommended Refactoring Plan

### **Step 1: Create Shared Kernel for Common Entities**

```typescript
// src/shared/domain/references/UserReference.ts
export interface UserReference {
  id: number;
  name: string;
  email: string;
}

// src/shared/domain/references/PropertyReference.ts
export interface PropertyReference {
  id: number;
  property_name: string;
  address: string;
  city: string;
  type: string;
}
```

### **Step 2: Update Bookings Service to Use References**

```typescript
// src/modules/bookings/domain/services/BookingService.ts
import { UserReference, PropertyReference } from '../../../../shared/domain/references';

export interface BookingWithRelations extends Booking {
  user?: UserReference;        // ✅ Changed from User to UserReference
  property?: PropertyReference; // ✅ Changed from Property to PropertyReference
}
```

### **Step 3: Create Adapters for Complex Operations**

```typescript
// src/modules/bookings/infrastructure/adapters/UserRepositoryAdapter.ts
// Fetches user data and transforms to UserReference
```

### **Step 4: Update Repository to Transform Data**

```typescript
// In BookingRepository, transform joined Sequelize results to use references
private transformToUserReference(userModel: any): UserReference {
  return {
    id: userModel.id,
    name: userModel.name,
    email: userModel.email
  };
}
```

---

## 🎯 Decision Matrix

| Scenario | Recommended Pattern | Reason |
|----------|---------------------|--------|
| **Read-only entity references** | Shared Kernel | Simple, minimal coupling |
| **Complex cross-module operations** | Anti-Corruption Layer | Full isolation, flexible |
| **Reacting to other module events** | Domain Events | Decoupled, scalable |
| **Coordinating multiple modules** | Application Services | Appropriate layer for orchestration |
| **Database joins (Infrastructure)** | Current approach (OK) | Acceptable but add transformation |

---

## 🚀 Migration Path

### **Phase 1: Immediate (This Week)**
1. ✅ Create `src/shared/domain/references/` folder
2. ✅ Define `UserReference` and `PropertyReference`
3. ✅ Update `BookingWithRelations` to use references

### **Phase 2: Short Term (This Month)**
1. ✅ Create adapter interfaces
2. ✅ Implement adapters in infrastructure
3. ✅ Refactor repository to use adapters
4. ✅ Remove direct domain imports

### **Phase 3: Long Term (Future)**
1. ✅ Implement Domain Events for cross-module communication
2. ✅ Replace direct service calls with events where appropriate
3. ✅ Add integration tests for cross-module operations

---

## ✅ Best Practices Summary

1. **Domain → Domain**: ❌ NEVER
2. **Infrastructure → Infrastructure**: ✅ OK (but use shared references)
3. **Application → Application**: ✅ OK (for orchestration)
4. **Use Shared Kernel**: ✅ For simple read-only references
5. **Use ACL**: ✅ For complex dependencies
6. **Use Events**: ✅ For cross-module reactions
7. **Store IDs**: ✅ Prefer foreign keys over full entities
8. **Transform in Infrastructure**: ✅ Convert joined data to references

---

## 📚 Example: Complete Refactored Bookings Module

See `REFACTORED_BOOKINGS_EXAMPLE.md` for a complete example of how the Bookings module should be structured with proper interdependency handling.

---

## 🎓 Key Takeaways

1. **Domain layers must be independent** - They should not know about other modules
2. **Infrastructure can depend on infrastructure** - But prefer shared references
3. **Application can orchestrate** - But prefer events for loose coupling
4. **Use IDs, not entities** - Store foreign keys, fetch full data when needed
5. **Transform at boundaries** - Convert between module representations at infrastructure layer

---

This approach ensures your modules remain independent and can be easily extracted into microservices when needed! 🚀

