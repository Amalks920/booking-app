import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { IBookingService } from '../../domain/services/BookingService';
import { SequelizeBookingRepository } from '../repositories/BookingRepository';
import { BookingService } from '../../domain/services/BookingService';
import { BookingController } from '../../application/controllers/BookingController';

export class BookingContainer {
  private static instance: BookingContainer;
  
  private constructor() {}
  
  static getInstance(): BookingContainer {
    if (!BookingContainer.instance) {
      BookingContainer.instance = new BookingContainer();
    }
    return BookingContainer.instance;
  }

  // Repository - can be easily swapped for different implementations
  getBookingRepository(): IBookingRepository {
    return new SequelizeBookingRepository();
  }

  // Service - depends on repository interface, not concrete implementation
  getBookingService(): IBookingService {
    const repository = this.getBookingRepository();
    return new BookingService(repository);
  }

  // Controller - depends on service interface, not concrete implementation
  getBookingController(): BookingController {
    const service = this.getBookingService();
    return new BookingController(service);
  }
}

// Alternative: Factory pattern for even more flexibility
export class BookingFactory {
  static createRepository(type: 'sequelize' | 'mongoose' | 'mock'): IBookingRepository {
    switch (type) {
      case 'sequelize':
        return new SequelizeBookingRepository();
      case 'mongoose':
        // return new MongooseBookingRepository();
        throw new Error('Mongoose repository not implemented yet');
      case 'mock':
        // return new MockBookingRepository();
        throw new Error('Mock repository not implemented yet');
      default:
        throw new Error(`Unknown repository type: ${type}`);
    }
  }

  static createService(repositoryType: 'sequelize' | 'mongoose' | 'mock'): IBookingService {
    const repository = this.createRepository(repositoryType);
    return new BookingService(repository);
  }

  static createController(serviceType: 'sequelize' | 'mongoose' | 'mock'): BookingController {
    const service = this.createService(serviceType);
    return new BookingController(service);
  }
} 