import {
	ScrollText,
	MapPinned,
	CalendarFold,
	UsersRound,
	CircleDollarSign,
	LoaderCircle,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function JoinedEvents() {
	const { get, del } = useAxios();
	const [loading, setLoading] = useState(true);
	const [joins, setJoins] = useState([]);

	useEffect(() => {
		const fetchJoined = async () => {
			setLoading(true);
			try {
				const data = await get("/api/event/joins");
				setJoins(data.joined);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchJoined();
	}, []);

	const handleLeaveEvent = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/event/joins/${id}`);
			toast.success(data.message || "Leave Successful");
			setJoins((prevJoins) => prevJoins.filter((join) => join.event._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Leave Failed");
			console.error(error);
		}
	};

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

	if (!joins || joins.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Joined Events
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Events You've Joined
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<main className="h-[90vh] p-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
				{joins.map((join) => (
					<Card
						key={join._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardHeader className="flex justify-between items-center bg-gradient-to-r from-rose-600 to-rose-900 text-primary-foreground rounded-t-xl p-4">
							<div className="text-center">
								<CardTitle>
									<h4 className="text-2xl font-semibold">{join.event.title}</h4>
								</CardTitle>
								<Badge className="text-xs bg-card hover:bg-accent text-primary-foreground">
									{join.event.club.name}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							<div className="flex flex-col gap-2">
								<img
									src={`${import.meta.env.VITE_API_URL}/api/${join.event.cover}`}
									alt={`${join.event.title} cover`}
									className="rounded-lg object-cover w-full h-36"
								/>
								<div className="flex items-start gap-2">
									<ScrollText className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Description:</p>
										<p className="text-primary-foreground">{join.event.description}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<MapPinned className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Venue:</p>
										<p className="text-primary-foreground">{join.event.venue}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CalendarFold className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Date:</p>
										<p className="text-primary-foreground">
											{new Date(join.event.date).toLocaleDateString("en-Uk", {
												day: "2-digit",
												month: "long",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								<div className="flex items-start">
									<div className="flex flex-col text-left p-2 flex-1">
										<div className="flex items-start gap-2">
											<UsersRound className="text-primary w-5 h-7" />
											<div>
												<p className="font-bold text-primary">Capacity:</p>
												<p className="text-primary-foreground">
													{join.event.capacity} Guests
												</p>
											</div>
										</div>
									</div>
									<Separator orientation="vertical" />
									<div className="flex flex-col text-left p-2 flex-1">
										<div className="flex items-start gap-2">
											<CircleDollarSign className="text-primary w-5 h-7" />
											<div>
												<p className="font-bold text-primary">Entry Fee:</p>
												<p className="text-primary-foreground">{join.event.entry} Taka</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter className="rounded-b-xl flex justify-center">
							<Button
								onClick={(e) => handleLeaveEvent(e, join.event._id)}
								className="rounded">
								Leave Event
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
}
