import { useEffect, useState } from "react";
import { eventsData } from "../data/events";
import { type EventItem } from "../data/types";

export function useUpcomingEvents(communityNames?: string[]) {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const now = new Date();

    const filtered = eventsData.filter(event => {
      const eventDate = new Date(event.date);

      return (
        eventDate >= now &&
        (!communityNames ||
          event.communities.some(c => communityNames.includes(c)))
      );
    });

    setUpcomingEvents(filtered);
  }, [communityNames]);

  return upcomingEvents;
}
