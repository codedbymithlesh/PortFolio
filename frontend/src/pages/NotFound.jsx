import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DecodeText from '../components/DecodeText';

export default function NotFound() {
  return (
    <div className="status-page status-page--not-found">
      <div className="container status-page__inner">
        <p className="status-page__code" aria-hidden="true">404</p>
        <h1 className="status-page__title">Page not found</h1>
        <p className="status-page__text">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="button button--primary">
          <FaArrowLeft aria-hidden="true" />
          <DecodeText>Back to home</DecodeText>
        </Link>
      </div>
    </div>
  );
}
