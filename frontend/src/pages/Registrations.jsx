import { UserRound, Mail, LoaderCircle, Building2, Phone } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";

import useAxios from "../hooks/useAxios.jsx";

export default function Registrations() {
	const { get, post, del } = useAxios();
	const [loading, setLoading] = useState(true);
	const [guests, setGuests] = useState([]);

	useEffect(() => {
		const fetchGuests = async () => {
			setLoading(true);
			try {
				const data = await get("/api/user/registers");
				setGuests(data.registers);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchGuests();
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

	if (guests.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Registrations
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Guest Registrations
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleAccept = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/user/registers/${id}`, {});
			toast.success(data.message || "Accept Success");
			setGuests(guests.filter((guest) => guest._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Accept Failed");
			console.error(error);
		}
	};

	const handleReject = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/user/registers/${id}`);
			toast.success(data.message || "Reject Success");
			setGuests(guests.filter((guest) => guest._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Reject Failed");
			console.error(error);
		}
	};

	return (
		<main className="h-[90vh] p-4">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
				{guests.map((guest) => (
					<Card
						key={guest._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardContent className="p-4">
							<div className="flex flex-col gap-4">
								<div className="flex items-start gap-2">
									<UserRound className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Guest:</p>
										<p className="text-primary-foreground">{guest.name}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Building2 className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Club:</p>
										<p className="text-primary-foreground">
                      {guest.club ? guest.club.name : "No Club"}
                    </p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Phone className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Phone:</p>
										<p className="text-primary-foreground">{guest.phone}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Mail className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Email:</p>
										<p className="text-primary-foreground">{guest.email}</p>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter className="rounded-b-xl flex justify-center gap-8 mt-2">
							<Button
								onClick={(e) => handleAccept(e, guest._id)}
								className="text-primary-foreground bg-emerald-700 hover:bg-emerald-700/90 rounded">
								<span className="flex items-center gap-1">Accept</span>
							</Button>
							<Button
								onClick={(e) => handleReject(e, guest._id)}
								className="rounded">
								<span className="flex items-center gap-1">Reject</span>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
}
