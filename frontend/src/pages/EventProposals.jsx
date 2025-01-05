import {
	ScrollText,
	MapPinned,
	CalendarFold,
	UserRound,
	CircleDollarSign,
	Armchair,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function EventProposals() {
	const formData = {
		cost: "",
		capacity: "",
	};
	const { get, post, del } = useAxios();
	const [loading, setLoading] = useState(true);
	const [proposals, setProposals] = useState([]);
	const [clicked, setClicked] = useState(null);
	const [form, setForm] = useState(formData);

	useEffect(() => {
		const fetchProposals = async () => {
			setLoading(true);
			try {
				const data = await get("/api/event/proposals");
				setProposals(data.requests);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchProposals();
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

	if (proposals.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Event Proposals
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Event Proposals
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleToggle = (id) => {
		setClicked(clicked === id ? null : id);
	};

	const handleChange = (event) => {
		setForm({
			...form,
			[event.target.name]: event.target.value,
		});
	};

	const handleApprove = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/event/proposals/${id}`, form);
			toast.success(data.message || "Approve Success");
			setProposals(proposals.filter((proposal) => proposal._id !== id));
			setClicked(null);
			setForm(formData);
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Approve Failed");
			console.error(error);
		}
	};

	const handleDecline = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/event/proposals/${id}`);
			toast.success(data.message || "Decline Success");
			setProposals(proposals.filter((proposal) => proposal._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Decline Failed");
			console.error(error);
		}
	};

	return (
		<main className="h-[90vh] p-6">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-5">
				{proposals.map((proposal) => (
					<Card
						key={proposal._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardHeader className="flex justify-between items-center bg-gradient-to-r from-rose-600 to-rose-900 text-primary-foreground rounded-t-xl p-6">
							<div className="text-center">
								<CardTitle>
									<h4 className="text-2xl text-primary-foreground font-semibold">
										{proposal.title}
									</h4>
								</CardTitle>
								<Badge className="text-xs bg-card hover:bg-accent text-primary-foreground">
									{proposal.club.name}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="p-6">
							<div className="flex flex-col gap-4">
								<div className="flex items-start gap-2">
									<ScrollText className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Description:</p>
										<p className="text-primary-foreground">
											{proposal.description}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CalendarFold className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Date:</p>
										<p className="text-primary-foreground">
											{new Date(proposal.date).toLocaleDateString("en-UK", {
												day: "2-digit",
												month: "long",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<MapPinned className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Venue:</p>
										<p className="text-primary-foreground">{proposal.venue}</p>
									</div>
								</div>
								<Separator className="bg-primary" />
								<div className="flex items-start gap-2">
									{clicked === proposal._id ? (
										<div className="flex flex-col gap-2 w-full">
											<div className="flex items-center gap-2">
												<CircleDollarSign className="text-primary w-15 h-15" />
												<label
													htmlFor="cost"
													className="w-1/4 text-primary font-semibold">
													Expense
												</label>
												<Input
													type="text"
													name="cost"
													value={form.cost}
													onChange={handleChange}
													placeholder="Event Cost"
													className="w-3/4 pl-2 pr-4 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
											<div className="flex items-center gap-2">
												<Armchair className="text-primary w-15 h-15" />
												<label
													htmlFor="cost"
													className="w-1/4 text-primary font-semibold">
													Capacity
												</label>
												<Input
													type="text"
													name="capacity"
													value={form.capacity}
													onChange={handleChange}
													placeholder="Event Capacity"
													className="w-3/4 pl-2 pr-4 border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
												/>
											</div>
										</div>
									) : (
										<div className="flex items-start gap-2">
											<UserRound className="text-primary w-5 h-10" />
											<div className="flex flex-col w-full my-2">
												<p className="font-bold text-primary">Requested By:</p>
												<p className="text-primary-foreground font-semibold">
													{proposal.panel.name}
												</p>
												<p className="text-muted-foreground">
													{`${proposal.panel.designation}, ${proposal.club.name}`}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
						<CardFooter className="rounded-b-xl flex justify-center gap-10">
							<Button
								onClick={(e) =>
									clicked === proposal._id
										? handleApprove(e, proposal._id)
										: handleToggle(proposal._id)
								}
								className="text-primary-foreground bg-emerald-700 hover:bg-emerald-700/90 rounded">
								<span className="flex items-center gap-1">
									{clicked === proposal._id ? "Submit" : "Approve"}
								</span>
							</Button>
							<Button
								onClick={(e) =>
									clicked === proposal._id
										? setClicked(null)
										: handleDecline(e, proposal._id)
								}
								className="rounded">
								<span className="flex items-center gap-1">
									{clicked === proposal._id ? "Cancel" : "Decline"}
								</span>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
}
