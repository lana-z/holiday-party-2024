import { FaCalendarPlus } from 'react-icons/fa'

export default function AddToCalendar() {
  const eventDetails = {
    text: "Swanky Holiday Party 2024",
    dates: "20241221T180000/20241221T220000", // Dec 21, 2024, 6:00 PM - 10:00 PM
    details: "Wear your favorite party outfit for an evening of pintxos-style bites, wines, craft cocktails, and warm vibes.",
  }

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}`

  return (
    <div className="text-center mb-8">
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-md text-[#fdf7d7] bg-burgundy hover:bg-burgundy/90 transition-colors duration-200 font-playfair"
      >
        <FaCalendarPlus className="mr-2" />
        Add to Calendar
      </a>
    </div>
  )
}
