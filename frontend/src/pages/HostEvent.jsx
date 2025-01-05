import {
	Album,
	MapPinned,
	CalendarFold,
	Landmark,
	CircleDollarSign,
	Armchair,
	UserRound,
	ScrollText,
	DollarSign,
	Image,
	LoaderCircle,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function HostEvent() {
	const formInit = {
		entry: "",
		cover: "",
	};
	const { get, post, del } = useAxios();
	const [approvals, setApprovals] = useState([]);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState(formInit);

	useEffect(() => {
		const fetchApprovals = async () => {
			setLoading(true);
			try {
				const data = await get("/api/event/approvals");
				setApprovals(data.startup);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchApprovals();
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

	if (!approvals || approvals.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Host Event
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Event Request Not Approved Yet For Hosting
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleChange = (e) => {
		const { name, value, files } = e.target;

		if (files) {
			setForm({
				...form,
				[name]: files[0],
			});
		} else {
			setForm({
				...form,
				[name]: value,
			});
		}
	};

	const handleLaunch = async (e, id) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append("entry", form.entry);
			formData.append("cover", form.cover);

			const data = await post(`/api/event/approvals/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			toast.success(data.message || "Launch Success");
			setApprovals(approvals.filter((approval) => approval._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Launch Failed");
			console.error(error);
		}
	};

	const handlePostpone = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/event/approvals/${id}`);
			toast.success(data.message || "Postpone Success");
			setApprovals(approvals.filter((approval) => approval._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Postpone Failed");
			console.error(error);
		}
	};

	return (
		<div className="h-[90vh] flex items-center justify-center p-6">
			{approvals.map((approval) => (
				<Card
					key={approval._id}
					className="w-8/12 h-auto rounded-3xl shadow-lg bg-card">
					<CardHeader className="flex justify-center items-center">
						<CardTitle className="text-center text-3xl font-bold text-primary">
							Host Event
						</CardTitle>
						<CardDescription className="flex justify-between items-center">
							<Badge className="text-xs bg-accent hover:bg-background text-primary-foreground">
								{approval.club.name}
							</Badge>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Separator className="h-[1px] bg-primary" />
						<div className="flex items-start space-x-6">
							<div className="flex flex-col text-left p-2 space-y-4 flex-1">
								<div className="flex items-start gap-2">
									<Album className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Event Title:</p>
										<p className="text-primary-foreground">{approval.title}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<ScrollText className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Description:</p>
										<p className="text-primary-foreground">
											{approval.description}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<MapPinned className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Event Venue:</p>
										<p className="text-primary-foreground">{approval.venue}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CalendarFold className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Event Date:</p>
										<p className="text-primary-foreground">
											{new Date(approval.date).toLocaleDateString("en-UK", {
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
										<p className="text-primary-foreground">
											{approval.club.reserve} Taka
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CircleDollarSign className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Event Cost:</p>
										<p className="text-primary-foreground">
											{approval.cost} Taka
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Armchair className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Venue Capacity:</p>
										<p className="text-primary-foreground">
											{approval.capacity} Guests
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<UserRound className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Approved By:</p>
										<p className="text-primary-foreground font-semibold">
											{approval.officer.name}
										</p>
										<p className="text-muted-foreground">
											{`${approval.officer.role}, ${approval.officer.designation}`}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-6">
							<div className="flex flex-col text-left p-2 space-y-4 flex-1">
								<div className="w-full flex items-center gap-2">
									<DollarSign className="text-primary w-15 h-7" />
									<label
										htmlFor="entry"
										className="w-1/6 text-primary font-semibold">
										Entry
									</label>
									<Input
										type="text"
										name="entry"
										value={form.entry}
										placeholder="Entry Fee"
										onChange={handleChange}
										className="w-4/6 pl-2 pr-4 mr-10 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
								</div>
							</div>
							<Separator orientation="vertical" />
							<div className="flex flex-col text-left space-y-4 p-2 flex-1">
								<div className="w-full flex items-center gap-2">
									<Image className="text-primary w-15 h-7" />
									<label
										htmlFor="cover"
										className="w-1/6 text-primary font-semibold">
										Cover
									</label>
									<Input
										type="file"
										name="cover"
										onChange={handleChange}
										className="w-4/6 pl-2 pr-4 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex items-start space-x-6">
						<div className="flex flex-col text-left p-2 space-y-4 flex-1">
							<Button
								onClick={(e) => handleLaunch(e, approval._id)}
								className="w-full flex items-center gap-2 rounded">
								Launch Event
							</Button>
						</div>
						<div className="flex flex-col text-left p-2 space-y-4 flex-1">
							<Button
								variant="secondary"
								onClick={(e) => handlePostpone(e, approval._id)}
								className="w-full flex items-center gap-2 rounded">
								Postpone Event
							</Button>
						</div>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
