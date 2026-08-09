import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const points = [
  { icon: Truck, title: 'Fast dispatch', text: 'Most orders ship within 48 hours from our regional hubs.' },
  { icon: ShieldCheck, title: 'Vetted sellers', text: 'Every brand on ARC is reviewed before their first listing goes live.' },
  { icon: RotateCcw, title: '30-day returns', text: 'Changed your mind? Free returns on unused items, no questions.' },
  { icon: Headphones, title: 'Real support', text: 'A human replies to every message within one business day.' },
];

export default function WhyChooseUs() {
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section__head section__head--light">
          <span className="eyebrow eyebrow--light">Why ARC</span>
          <h2>Built for people who are busy, not careless</h2>
        </div>
        <div className="why-grid">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              className="why-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <p.icon size={22} />
              <h4>{p.title}</h4>
              <p>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
