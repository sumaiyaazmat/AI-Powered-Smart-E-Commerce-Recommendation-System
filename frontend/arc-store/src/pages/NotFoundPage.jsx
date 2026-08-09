import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container empty-state empty-state--tall">
      <h1 style={{ fontSize: '4rem' }}>404</h1>
      <p>This page wandered off. Let's get you back on track.</p>
      <Button as={Link} to="/" variant="primary">Back to Home</Button>
    </div>
  );
}
