// // src/infrastructure/routes/userProfileRoutes.ts
// import { Router } from 'express';
// import { UserProfileController } from '../../application/controllers/U';
// import { UserProfileService } from '../../domain/services/';
// import { UserProfileRepositoryImpl } from '../repositories/UserProfileRepositoryImpl';

// const router = Router();

// // Dependency injection
// const userProfileRepository = new UserProfileRepositoryImpl();
// const userProfileService = new UserProfileService(userProfileRepository);
// const userProfileController = new UserProfileController(userProfileService);

// // Routes
// router.get('/', (req, res) => userProfileController.getAllProfiles(req, res));
// router.get('/:id', (req, res) => userProfileController.getProfileById(req, res));
// router.post('/', (req, res) => userProfileController.createProfile(req, res));
// router.put('/:id', (req, res) => userProfileController.updateProfile(req, res));
// router.delete('/:id', (req, res) => userProfileController.deleteProfile(req, res));

// export default router;
