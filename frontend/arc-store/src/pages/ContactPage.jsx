import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { showToast } = useToast();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Message sent. We\u2019ll get back to you within a day.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container contact-page">
      <motion.div
        className="section__head"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="eyebrow">Get in touch</span>
        <h1>We reply to real questions with real answers</h1>
      </motion.div>

      <div className="contact-grid">
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <label className="field">
            <span>Name</span>
            <div className="field__input">
              <input required value={form.name} onChange={update('name')} placeholder="Your name" />
            </div>
          </label>
          <label className="field">
            <span>Email</span>
            <div className="field__input">
              <input type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
            </div>
          </label>
          <label className="field">
            <span>Subject</span>
            <div className="field__input">
              <input required value={form.subject} onChange={update('subject')} placeholder="Order question, partnership, feedback…" />
            </div>
          </label>
          <label className="field">
            <span>Message</span>
            <div className="field__input field__input--textarea">
              <textarea required rows={5} value={form.message} onChange={update('message')} placeholder="Tell us what's going on" />
            </div>
          </label>
          <Button type="submit" variant="primary" size="lg" icon={Send}>
            Send Message
          </Button>
        </motion.form>

        <motion.aside
          className="contact-info"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="contact-info__item">
            <Mail size={18} />
            <div><strong>Email</strong><span>hello@arcmarket.com</span></div>
          </div>
          <div className="contact-info__item">
            <Phone size={18} />
            <div><strong>Phone</strong><span>+1 (555) 018-2043</span></div>
          </div>
          <div className="contact-info__item">
            <MapPin size={18} />
            <div><strong>Location</strong><span>212 Market Street, Austin, TX</span></div>
          </div>
          <div className="contact-info__social">
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
