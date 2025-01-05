import {
  Album,
  MapPinned,
  CalendarFold,
  Landmark,
  CircleDollarSign,
  Armchair,
	UserRound,
  UsersRound,
  ScrollText,
  LoaderCircle,
	HandCoins,
	DollarSign,
	Coins,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function ClubEvent() {
  const { get } = useAxios();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchClubEvent = async () => {
      setLoading(true);
      try {
        const data = await get("/api/event/club");
        setEvents(data.clubevent);
        console.log(data);
      } catch (error) {
        toast.error(error.data.message || "Fetch Failed");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubEvent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="animate-spin text-primary">
          <LoaderCircle size={64} strokeWidth={1} />
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="h-[90vh] flex items-center justify-center p-6">
        <Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
          <CardHeader className="text-center text-2xl font-bold text-primary">
            Club Event
          </CardHeader>
          <CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
            Could Not Find Any Hosted Club Event
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[90vh] flex items-center justify-center p-6">
      {events.map((event) => (
        <Card
          key={event._id}
          className="w-9/12 h-[600px] rounded-3xl shadow-lg bg-card"
        >
          <CardHeader className="flex justify-center items-center">
            <CardTitle className="text-center text-3xl font-bold text-primary">
              Club Event
            </CardTitle>
            <CardDescription className="flex justify-between items-center">
              <Badge className="text-xs bg-accent hover:bg-background text-primary-foreground">
                {event.club.name}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
						<img
							src={`${import.meta.env.VITE_API_URL}/api/${event.cover}`}
							alt={`${event.title} cover`}
							className="rounded-3xl object-cover w-full h-48"
						/>
            <div className="flex items-start space-x-6">
              <div className="flex flex-col text-left p-2 space-y-4 flex-1">
                <div className="flex items-start gap-2">
                  <Album className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Title:</p>
                    <p className="text-primary-foreground">{event.title}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ScrollText className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Description:</p>
                    <p className="text-primary-foreground">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPinned className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Venue:</p>
                    <p className="text-primary-foreground">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarFold className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Date:</p>
                    <p className="text-primary-foreground">
                      {new Date(event.date).toLocaleDateString("en-UK", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <Separator orientation="vertical" />
              <div className="flex flex-col text-left space-y-4 p-2 flex-1">
                <div className="flex items-start gap-2">
                  <Landmark className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Club Reserve:</p>
                    <p className="text-primary-foreground">{event.club.reserve} Taka</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Armchair className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Capacity:</p>
                    <p className="text-primary-foreground">{event.capacity} Guests</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <UsersRound className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Guests:</p>
                    <p className="text-primary-foreground">{event.guests} Guest/s</p>
                  </div>
                </div>
								<div className="flex items-start gap-2">
                  <CircleDollarSign className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Entry Fee:</p>
                    <p className="text-primary-foreground">{event.entry} Taka</p>
                  </div>
                </div>
              </div>
							<Separator orientation="vertical" />
							<div className="flex flex-col text-left p-2 space-y-4 flex-1">
								<div className="flex items-start gap-2">
                  <DollarSign className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Cost:</p>
                    <p className="text-primary-foreground">{event.cost} Taka</p>
                  </div>
                </div>
								<div className="flex items-start gap-2">
                  <HandCoins className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Funds:</p>
                    <p className="text-primary-foreground">{event.funds} Taka</p>
                  </div>
                </div>
								<div className="flex items-start gap-2">
                  <Coins className="text-primary w-5 h-7" />
                  <div>
                    <p className="font-bold text-primary">Event Revenue:</p>
                    <p className="text-primary-foreground">{event.revenue} Taka</p>
                  </div>
                </div>
								<div className="flex items-start gap-2">
                  <UserRound className="text-primary w-5 h-7"/>
                  <div>
                    <p className="font-bold text-primary">Approved By:</p>
                    <p className="text-primary-foreground font-semibold">
                      {event.officer.name}
                    </p>
                    <p className="text-muted-foreground">
                      {`${event.officer.role}, ${event.officer.designation}`}
                    </p>
                  </div>
                </div>
							</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
