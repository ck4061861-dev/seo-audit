import Contact from '../Models/contact.model.js';

export async function submitContact(req, res) {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }

    const contact = await Contact.create({ name, email, message });

    // optional: send email notification when configured
    // if (process.env.NOTIFY_EMAIL && process.env.SMTP_ENABLED) { ... }

    return res.status(201).json({ message: 'Contact request submitted successfully.', id: contact._id });
  } catch (error) {
    console.error('Contact submit error:', error);
    res.status(500).json({ message: 'Could not submit contact request.' });
  }
}
