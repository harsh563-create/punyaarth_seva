import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-serif font-bold text-forest/20 mb-4">
          404
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text mb-4">
          Page Not Found
        </h1>
        <p className="text-text-muted text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. Let's
          get you back on track.
        </p>
        <Link to="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </section>
  );
}
