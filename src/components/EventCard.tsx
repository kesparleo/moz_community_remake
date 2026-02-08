import React, { useEffect, useState } from "react";
import { eventsData } from "../data/events";
import { type EventItem, type EventsProps } from "../data/types";
import styles from "../styles/Events.module.css";

const Events: React.FC<EventsProps> = ({ communityNames }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const now = new Date();
    const filtered = eventsData.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate >= now &&
        (!communityNames || event.communities.some(c => communityNames.includes(c)))
      );
    });

    setUpcomingEvents(filtered);
  }, [communityNames]);

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className={styles.events__container}>
      {upcomingEvents.map((event, idx) => (
        <div key={idx} className={styles.events__card}>
          {event.image && <img src={event.image} alt={event.title} className={styles.events__image} />}
          <h3 className={styles.events__title}>{event.title}</h3>
          <p className={styles.events__date}>{new Date(event.date).toLocaleDateString()}</p>
          {event.link && (
            <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.events__button}>
              Participar
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default Events;
