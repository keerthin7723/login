import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "../convex/_generated/dataModel";

export default function App() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 bg-white p-4 flex justify-between items-center border-b shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Activity Booking</h2>
        {loggedInUser && <SignOutButton />}
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {!loggedInUser ? (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">
                Activity Booking
              </h1>
              <p className="text-xl text-slate-600 mb-8">Sign in to book activities</p>
              <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
                <SignInForm />
              </div>
            </div>
          ) : (
            <AuthenticatedContent />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function AuthenticatedContent() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const activities = useQuery(api.activities.list) || [];
  const bookings = useQuery(api.bookings.listMine) || [];
  const bookActivity = useMutation(api.bookings.create);

  if (!loggedInUser) return null;

  const handleBook = async (activityId: Id<"activities">) => {
    try {
      await bookActivity({ activityId });
      toast.success("Activity booked successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to book activity");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Activity Booking
        </h1>
        <p className="text-xl text-slate-600">
          Welcome back, {loggedInUser?.email ?? "friend"}!
        </p>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Available Activities</h2>
          <div className="grid gap-4">
            {activities.map((activity) => (
              <div 
                key={activity._id} 
                className="border p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-slate-900">{activity.title}</h3>
                <p className="text-slate-600 mt-2">{activity.description}</p>
                <div className="mt-3 text-sm space-y-1">
                  <p className="text-slate-600">
                    <span className="font-medium">Location:</span> {activity.location}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Date:</span> {activity.date}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Time:</span> {activity.time}
                  </p>
                </div>
                <button
                  onClick={() => handleBook(activity._id)}
                  className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg 
                  hover:bg-slate-700 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">My Bookings</h2>
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="border p-6 rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900">{booking.activity?.title}</h3>
                <p className="text-slate-600 mt-2">{booking.activity?.description}</p>
                <div className="mt-3 text-sm space-y-1">
                  <p className="text-slate-600">
                    <span className="font-medium">Location:</span> {booking.activity?.location}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Date:</span> {booking.activity?.date}
                  </p>
                  <p className="text-slate-600">
                    <span className="font-medium">Time:</span> {booking.activity?.time}
                  </p>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-center text-slate-600 py-8">
                No bookings yet. Book an activity to get started!
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
