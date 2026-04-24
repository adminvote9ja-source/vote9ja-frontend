import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../styles/contest-card.css';

function ContestCard({ contest }) {
  return (
    <div className="contest-card">
      <div className="contest-image">
        <img src={contest.image} alt={contest.title} />
        <span className="badge">{contest.status}</span>
      </div>
      
      <div className="contest-content">
        <h3>{contest.title}</h3>
        <p className="description">{contest.description.substring(0, 100)}...</p>
        
        <div className="contest-meta">
          <span className="meta-item">
            <Calendar size={16} />
            {formatDistanceToNow(new Date(contest.endDate), { addSuffix: true })}
          </span>
          <span className="meta-item">
            <Trophy size={16} />
            ₦{contest.prizes[0]?.amount.toLocaleString()}
          </span>
        </div>
        
        <Link to={`/contests/${contest._id}`} className="cta-btn">
          View Contest
        </Link>
      </div>
    </div>
  );
}

export default ContestCard;
