import { LoaderCircle } from 'lucide-react';
import './Spinner.css';

export function Spinner() {
  return (
    <div className="spinner-wrap">
      <LoaderCircle className="spinner-icon" size={28} strokeWidth={2.5} />
    </div>
  );
}
