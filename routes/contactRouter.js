import express from 'express';
import { submitContactForm, getAllContacts } from '../controllers/contactController.js';

const contactRouter = express.Router();

// Route to handle form submission
contactRouter.post('/submit', submitContactForm);

// Route to fetch all contact submissions (optional, for admin or debugging)
contactRouter.get('/all', getAllContacts);

export default contactRouter;
