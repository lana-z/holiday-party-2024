import { FaCalendarPlus } from 'react-icons/fa'

export default function AddToCalendar() {
  const eventDetails = {
    text: "Holiday Cocktail Party",
    dates: "20231221T190000/20231222T000000",
    details: "Join us for a festive evening of pintxos-style bites, wines, and craft cocktails. Dress to impress!",
  }

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}`

  return (
    (<div className="text-center">
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gold hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold">
        <FaCalendarPlus className="mr-2" />
        Add to Calendar
      </a>
    </div>)
  );
}

