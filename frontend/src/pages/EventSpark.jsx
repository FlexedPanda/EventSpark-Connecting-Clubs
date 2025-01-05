import {
	LoaderCircle,
	Calendar1,
	MapPinned,
	CircleDollarSign,
	CalendarFold,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import useAxios from "../hooks/useAxios.jsx";

export default function EventSpark() {
	const { get } = useAxios();
	const [loading, setLoading] = useState(true);
	const [events, setEvents] = useState([]);

	useEffect(() => {
		const fetchCampusEvents = async () => {
			setLoading(true);
			try {
				const data = await get("/api/auth/events");
				setEvents(data.events);
				console.log(data);
			} catch (error) {
				toast.error(error?.response?.data?.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchCampusEvents();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[600px]">
				<div className="animate-spin text-primary">
					<LoaderCircle
						size={64}
						strokeWidth={1}
					/>
				</div>
			</div>
		);
	}

	if (!events || events.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Campus Events
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Ongoing Events
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-[90vh] px-6 py-12 bg-background">
			<div className="text-center my-10">
				<h1 className="text-4xl font-bold tracking-tighter text-primary">
					<a href="/app/home/login">EventSpark</a>
				</h1>
				<p className="text-lg text-muted-foreground mt-2">
					Bringing Your Event Experience to Life
				</p>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
				{events.map((event) => (
					<Card
						key={event._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardContent className="p-4">
							<div className="space-y-2">
								<div className="flex items-start gap-2">
									<Calendar1 className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Event:</p>
										<p className="font-semibold text-primary-foreground">{event.title}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<MapPinned className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Venue:</p>
										<p className="font-semibold text-primary-foreground">{event.venue}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CalendarFold className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Date:</p>
										<p className="font-semibold text-primary-foreground">
											{new Date(event.date).toLocaleDateString("en-UK", {
												day: "2-digit",
												month: "long",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CircleDollarSign className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Entry Fee:</p>
										<p className="font-semibold text-primary-foreground">{event.entry} Taka / Guest</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
