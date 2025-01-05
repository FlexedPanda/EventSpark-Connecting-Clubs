import {
	LoaderCircle,
	Album,
	CircleDollarSign,
	CalendarFold,
	UserRound,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

import useAxios from "../hooks/useAxios.jsx";

export default function SponsoredEvents() {
	const { get } = useAxios();
	const [loading, setLoading] = useState(false);
	const [funds, setFunds] = useState([]);

	useEffect(() => {
		const fetchSponsoredEvents = async () => {
			setLoading(true);
			try {
				const data = await get("/api/fund/sponsored");
				setFunds(data.funds);
				console.log(data);
			} catch (error) {
				toast.error(error.data.message || "Fetch Failed");
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchSponsoredEvents();
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

	if (!funds || funds.length === 0) {
		return (
			<div className="h-[90vh] flex items-center justify-center p-6">
				<Card className="transition-transform transform hover:scale-125 shadow-md hover:shadow-lg rounded-3xl">
					<CardHeader className="text-center text-2xl font-bold text-primary">
						Sponsored Events
					</CardHeader>
					<CardContent className="w-5/1 space-y-4 rounded-lg shadow-lg text-center text-primary-foreground">
						Could Not Find Any Sponsored Events
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<main className="h-[90vh] p-4">
			<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{funds.map((fund) => (
					<Card
						key={fund._id}
						className="transition-transform transform hover:scale-95 shadow-md hover:shadow-lg rounded-xl">
						<CardContent className="p-4">
							<div className="space-y-2">
								<div className="flex items-start gap-2">
									<Album className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Event:</p>
										<p className="text-primary-foreground">
											{fund.event.title}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CircleDollarSign className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Fund:</p>
										<p className="text-primary-foreground">
											{fund.amount} Taka
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<CalendarFold className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Date:</p>
										<p className="text-primary-foreground">
											{new Date(fund.createdAt).toLocaleDateString("en-UK", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
								<Separator className="bg-primary" />
								<div className="flex items-start gap-2">
									<UserRound className="text-primary w-5 h-7" />
									<div>
										<p className="font-bold text-primary">Approved By:</p>
										<p className="text-primary-foreground font-semibold">
											{fund.officer.name}
										</p>
										<p className="text-muted-foreground">
											{`${fund.officer.role}, ${fund.officer.designation}`}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</main>
	);
}
