import Contact from '../models/contact.js';

// Controller function for handling form submissions
export function submitContactForm(req, res) {
  const { name, email, message } = req.body;

  const newContact = new Contact({
    name,
    email,
    message
  });

  // Save the contact form to the database
  newContact.save()
    .then(() => {
      res.status(200).json({ message: 'Your message has been submitted successfully!' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    });
}

// Controller function to retrieve all contact submissions (optional)
export function getAllContacts(req, res) {
  // Find all contact submissions in the database
  Contact.find()
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Unable to retrieve contact submissions.' });
    });
}
