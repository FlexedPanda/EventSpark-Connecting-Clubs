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

export default function Applications() {
	const { get, post, del } = useAxios();
	const [loading, setLoading] = useState(true);
	const [sponsors, setSponsors] = useState([]);

	useEffect(() => {
		const fetchSponsors = async () => {
			setLoading(true);
			try {
				const data = await get("/api/user/applys");
				setSponsors(data.applys);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchSponsors();
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

	if (sponsors.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Applications
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Sponsor Applications
					</CardContent>
				</Card>
			</div>
		);
	}

	const handleRefer = async (e, id) => {
		e.preventDefault();
		try {
			const data = await post(`/api/user/applys/${id}`, {});
			toast.success(data.message || "Refer Success");
			setSponsors(sponsors.filter((sponsor) => sponsor._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Refer Failed");
			console.error(error);
		}
	};

	const handleDefer = async (e, id) => {
		e.preventDefault();
		try {
			const data = await del(`/api/user/applys/${id}`);
			toast.success(data.message || "Defer Success");
			setSponsors(sponsors.filter((sponsor) => sponsor._id !== id));
			console.log(data);
		} catch (error) {
			toast.error(error.data.message || "Defer Failed");
			console.error(error);
		}
	};

	return (
		<main className="h-[90vh] p-4">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
				{sponsors.map((sponsor) => (
					<Card
						key={sponsor._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardContent className="p-4">
							<div className="flex flex-col gap-4">
								<div className="flex items-start gap-2">
									<UserRound className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Agent:</p>
										<p className="text-primary-foreground">{sponsor.name}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Building2 className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Sponsor:</p>
										<p className="text-primary-foreground">{sponsor.company}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Phone className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Phone:</p>
										<p className="text-primary-foreground">{sponsor.phone}</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Mail className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Email:</p>
										<p className="text-primary-foreground">{sponsor.email}</p>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter className="rounded-b-xl flex justify-center gap-8 mt-2">
							<Button
								onClick={(e) => handleRefer(e, sponsor._id)}
								className="text-primary-foreground bg-emerald-700 hover:bg-emerald-700/90 rounded">
								<span className="flex items-center gap-1">Refer</span>
							</Button>
							<Button
								onClick={(e) => handleDefer(e, sponsor._id)}
								className="rounded">
								<span className="flex items-center gap-1">Defer</span>
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
}
