import {
	ScrollText,
	MapPinned,
	CalendarFold,
	UsersRound,
	CircleDollarSign,
	LoaderCircle,
	HandCoins,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function CampusEvents() {
	const { get, post } = useAxios();
	const type = localStorage.getItem("type");
	const [loading, setLoading] = useState(true);
	const [events, setEvents] = useState([]);
	const [funding, setFunding] = useState(null);
	const [amount, setAmount] = useState(null);

	useEffect(() => {
		const fetchCampusEvents = async () => {
			setLoading(true);
			try {
				const data = await get("/api/event/campus");
				setEvents(data.events);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
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
						Could Not Find Any Events to Join
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleFunding = (id) => {
		setFunding(id);
		setAmount(null);
	};

	const handleCancel = () => {
		setFunding(null);
		setAmount(null);
	};

	const handleJoinEvent = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/event/campus/${id}`, {});
			toast.success(data.message || "Joined Successful");
			setEvents(events.filter((event) => event._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Join Failed");
			console.error(error);
		}
	};

	const handleProvideFund = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/fund/provide/${id}`, { amount });
			toast.success(data.message || "Provided Successful");
			setEvents(events.filter((event) => event._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Provided Failed");
			console.error(error);
		}
	};

	const handleSponsorFund = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/fund/sponsor/${id}`, { amount });
			toast.success(data.message || "Sponsored Successful");
			setEvents(events.filter((event) => event._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Sponsored Failed");
			console.error(error);
		}
	};

	return (
		<main className="h-[90vh] p-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
				{events.map((event) => (
					<Card
						key={event._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardHeader className="flex justify-between items-center bg-gradient-to-r from-rose-600 to-rose-900 text-primary-foreground rounded-t-xl p-4">
							<div className="text-center">
								<CardTitle>
									<h4 className="text-2xl font-semibold">{event.title}</h4>
								</CardTitle>
								<Badge className="text-xs bg-card hover:bg-accent text-primary-foreground">
									{event.club.name}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							<div className="flex flex-col gap-2">
								<img
									src={`${import.meta.env.VITE_API_URL}/api/${event.cover}`}
									alt={`${event.title} cover`}
									className="rounded-xl object-cover w-full h-36"
								/>
								<div className="flex items-start gap-2">
									<ScrollText className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Description:</p>
										<p className="text-primary-foreground">
											{event.description}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<MapPinned className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Venue:</p>
										<p className="text-primary-foreground">{event.venue}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CalendarFold className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Date:</p>
										<p className="text-primary-foreground">
											{new Date(event.date).toLocaleDateString("en-Uk", {
												day: "2-digit",
												month: "long",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								{funding === event._id ? (
									<div className="flex items-center gap-2 mt-4 p-1">
										<HandCoins className="text-primary w-15 h-15" />
										<label
											htmlFor="cost"
											className="w-1/6 text-primary font-semibold">
											Fund
										</label>
										<Input
											type="number"
											name="amount"
											onChange={(e) => setAmount(e.target.value)}
											placeholder="Enter Amount"
											className="w-4/6 pl-4 pr-4 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										/>
									</div>
								) : (
									<div className="flex items-start">
										<div className="flex flex-col text-left p-2 flex-1">
											<div className="flex items-start gap-2">
												<UsersRound className="text-primary w-5 h-7" />
												<div>
													<p className="font-bold text-primary">Capacity:</p>
													<p className="text-primary-foreground">
														{event.capacity} Guests
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
													<p className="text-primary-foreground">
														{event.entry} Taka
													</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</CardContent>
						<CardFooter className="rounded-b-xl flex justify-center gap-10">
							{funding === event._id ? (
								<>
									{type === "Officer" && (
										<Button
											onClick={(e) => handleProvideFund(e, event._id)}
											className="text-primary-foreground bg-emerald-700 hover:bg-emerald-700/90 rounded">
											Provide
										</Button>
									)}
									{type === "Sponsor" && (
										<Button
											onClick={(e) => handleSponsorFund(e, event._id)}
											className="text-primary-foreground bg-emerald-700 hover:bg-emerald-700/90 rounded">
											Sponsor
										</Button>
									)}
									<Button
										onClick={handleCancel}
										className="rounded">
										Cancel
									</Button>
								</>
							) : (
								<>
									{type === "Guest" || type === "Panel" ? (
										<Button
											onClick={(e) => handleJoinEvent(e, event._id)}
											className="text-primary-foreground bg-emerald-700 rounded hover:bg-emerald-700/90">
											Join Event
										</Button>
									) : type === "Sponsor" ? (
										<Button
											onClick={() => handleFunding(event._id)}
											className="text-primary-foreground bg-slate-700 hover:bg-slate-700/90 rounded">
											Sponsor Event
										</Button>
									) : (
										type === "Officer" && (
											<Button
												onClick={() => handleFunding(event._id)}
												className="text-primary-foreground bg-slate-700 hover:bg-slate-700/90 rounded">
												Fund Event
											</Button>
										)
									)}
								</>
							)}
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
}
